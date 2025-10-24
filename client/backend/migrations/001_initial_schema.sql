-- Initial database schema for GeetaManthan+
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Firebase, but we store additional data)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255),
    display_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP,
    preferences JSONB DEFAULT '{}'::jsonb
);

-- Create index on firebase_uid for fast lookups
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_last_active ON users(last_active DESC);

-- Conversation sessions
CREATE TABLE conversation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    interaction_mode VARCHAR(20) DEFAULT 'wisdom' CHECK (interaction_mode IN ('socratic', 'wisdom', 'story')),
    summary TEXT,
    message_count INTEGER DEFAULT 0
);

-- Create indexes for conversation sessions
CREATE INDEX idx_sessions_user_id ON conversation_sessions(user_id, started_at DESC);
CREATE INDEX idx_sessions_active ON conversation_sessions(user_id) WHERE ended_at IS NULL;

-- Conversation messages
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    emotion_label VARCHAR(50),
    emotion_confidence FLOAT,
    emotion_emoji VARCHAR(10),
    emotion_color VARCHAR(20),
    verse_id VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sequence_number INTEGER NOT NULL
);

-- Create indexes for conversation messages
CREATE INDEX idx_messages_session ON conversation_messages(session_id, sequence_number);
CREATE INDEX idx_messages_created_at ON conversation_messages(created_at DESC);

-- Emotion logs for mood tracking
CREATE TABLE emotion_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    user_input TEXT NOT NULL,
    dominant_emotion VARCHAR(50) NOT NULL,
    emotion_confidence FLOAT NOT NULL,
    emotion_emoji VARCHAR(10) NOT NULL,
    emotion_color VARCHAR(20) NOT NULL,
    all_emotions JSONB, -- Array of all detected emotions
    verse_ids TEXT[], -- Array of verse IDs shown
    session_id UUID REFERENCES conversation_sessions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for emotion logs
CREATE INDEX idx_emotion_logs_user_date ON emotion_logs(user_id, log_date DESC);
CREATE INDEX idx_emotion_logs_emotion ON emotion_logs(user_id, dominant_emotion);
CREATE INDEX idx_emotion_logs_created_at ON emotion_logs(created_at DESC);

-- Verse metadata cache (for quick lookups)
CREATE TABLE verse_metadata (
    id VARCHAR(20) PRIMARY KEY,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    shloka TEXT NOT NULL,
    transliteration TEXT,
    eng_meaning TEXT NOT NULL,
    hin_meaning TEXT,
    word_meaning TEXT,
    themes TEXT[] -- Extracted themes for emotion mapping
);

-- Create indexes for verse metadata
CREATE INDEX idx_verse_chapter ON verse_metadata(chapter, verse);
CREATE INDEX idx_verse_themes ON verse_metadata USING GIN(themes);

-- Add constraints to ensure data integrity
ALTER TABLE conversation_messages 
ADD CONSTRAINT unique_session_sequence 
UNIQUE (session_id, sequence_number);

-- Add check constraints for valid data ranges
ALTER TABLE emotion_logs 
ADD CONSTRAINT valid_emotion_confidence 
CHECK (emotion_confidence >= 0.0 AND emotion_confidence <= 1.0);

ALTER TABLE conversation_messages 
ADD CONSTRAINT valid_emotion_confidence 
CHECK (emotion_confidence IS NULL OR (emotion_confidence >= 0.0 AND emotion_confidence <= 1.0));

-- Create a function to update message count in sessions
CREATE OR REPLACE FUNCTION update_session_message_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE conversation_sessions 
        SET message_count = message_count + 1 
        WHERE id = NEW.session_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE conversation_sessions 
        SET message_count = message_count - 1 
        WHERE id = OLD.session_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update message count
CREATE TRIGGER trigger_update_message_count
    AFTER INSERT OR DELETE ON conversation_messages
    FOR EACH ROW EXECUTE FUNCTION update_session_message_count();

-- Create a function to update last_active timestamp
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET last_active = CURRENT_TIMESTAMP 
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update user last_active on new sessions
CREATE TRIGGER trigger_update_user_last_active
    AFTER INSERT ON conversation_sessions
    FOR EACH ROW EXECUTE FUNCTION update_user_last_active();