# Emotion Mappings Reference

Complete mapping of all 28 GoEmotions labels to emojis and colors used in GeetaManthan+.

## Positive Emotions (11)

| Emotion | Emoji | Color | Hex Code | Description |
|---------|-------|-------|----------|-------------|
| joy | 😊 | Light Yellow | #FEF3C7 | Happiness, contentment |
| admiration | 🤩 | Light Yellow | #FEF3C7 | Respect, appreciation |
| approval | 👍 | Light Green | #D1FAE5 | Agreement, acceptance |
| gratitude | 🙏 | Light Yellow | #FEF3C7 | Thankfulness |
| love | ❤️ | Light Red | #FECACA | Affection, care |
| optimism | 😊 | Light Green | #D1FAE5 | Hopefulness |
| caring | 🤗 | Light Green | #D1FAE5 | Compassion, concern |
| excitement | 🎉 | Light Yellow | #FEF3C7 | Enthusiasm |
| amusement | 😄 | Light Yellow | #FEF3C7 | Entertainment, fun |
| pride | 😌 | Light Yellow | #FEF3C7 | Satisfaction in achievement |
| relief | 😌 | Light Green | #D1FAE5 | Release from stress |

## Ambiguous Emotions (4)

| Emotion | Emoji | Color | Hex Code | Description |
|---------|-------|-------|----------|-------------|
| desire | 🤔 | Light Blue | #E0E7FF | Wanting, longing |
| realization | 💡 | Light Yellow | #FEF3C7 | Understanding, insight |
| curiosity | 🤔 | Light Blue | #E0E7FF | Interest, inquisitiveness |
| neutral | 😐 | Light Gray | #F3F4F6 | No strong emotion |

## Negative Emotions - Sadness (5)

| Emotion | Emoji | Color | Hex Code | Description |
|---------|-------|-------|----------|-------------|
| sadness | 😢 | Soft Blue | #DBEAFE | Sorrow, unhappiness |
| disappointment | 😞 | Soft Blue | #DBEAFE | Unmet expectations |
| grief | 😭 | Soft Blue | #DBEAFE | Deep sorrow, loss |
| remorse | 😔 | Soft Blue | #DBEAFE | Regret, guilt |
| embarrassment | 😳 | Light Red | #FEE2E2 | Shame, awkwardness |

## Negative Emotions - Anger (4)

| Emotion | Emoji | Color | Hex Code | Description |
|---------|-------|-------|----------|-------------|
| anger | 😠 | Light Red | #FEE2E2 | Rage, fury |
| annoyance | 😒 | Light Red | #FEE2E2 | Irritation |
| disapproval | 👎 | Light Red | #FEE2E2 | Disagreement, rejection |
| disgust | 🤢 | Light Red | #FEE2E2 | Revulsion, distaste |

## Negative Emotions - Fear/Anxiety (2)

| Emotion | Emoji | Color | Hex Code | Description |
|---------|-------|-------|----------|-------------|
| fear | 😰 | Lavender | #EDE9FE | Afraid, scared |
| nervousness | 😰 | Light Blue | #E0E7FF | Anxious, worried |

## Confusion (2)

| Emotion | Emoji | Color | Hex Code | Description |
|---------|-------|-------|----------|-------------|
| confusion | 😕 | Light Gray | #F3F4F6 | Uncertainty, bewilderment |
| surprise | 😲 | Light Blue | #E0E7FF | Astonishment, shock |

## Color Palette Summary

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Light Yellow | #FEF3C7 | Joy, positive emotions |
| Light Green | #D1FAE5 | Peace, approval, caring |
| Soft Blue | #DBEAFE | Sadness, grief |
| Light Red | #FEE2E2 | Anger, embarrassment |
| Light Blue | #E0E7FF | Anxiety, curiosity |
| Lavender | #EDE9FE | Fear |
| Light Gray | #F3F4F6 | Neutral, confusion |

## Emotion-Theme Mapping for Verse Selection

Emotions are mapped to Bhagavad Gita themes for better verse retrieval:

```python
EMOTION_THEME_MAP = {
    # Anxiety and worry
    "nervousness": ["surrender", "faith", "detachment"],
    "fear": ["courage", "protection", "divine_support"],
    
    # Confusion and doubt
    "confusion": ["clarity", "wisdom", "guidance"],
    "curiosity": ["knowledge", "learning", "understanding"],
    
    # Anger and frustration
    "anger": ["equanimity", "self-control", "forgiveness"],
    "annoyance": ["patience", "tolerance", "peace"],
    "disapproval": ["acceptance", "understanding", "compassion"],
    "disgust": ["purity", "detachment", "equanimity"],
    
    # Sadness and grief
    "sadness": ["hope", "resilience", "purpose"],
    "grief": ["acceptance", "impermanence", "strength"],
    "disappointment": ["detachment", "perseverance", "faith"],
    "remorse": ["forgiveness", "learning", "growth"],
    "embarrassment": ["self-acceptance", "humility", "growth"],
    
    # Joy and positive emotions
    "joy": ["gratitude", "devotion", "celebration"],
    "gratitude": ["devotion", "humility", "appreciation"],
    "love": ["devotion", "compassion", "unity"],
    "admiration": ["respect", "learning", "inspiration"],
    "pride": ["humility", "service", "dharma"],
    "excitement": ["enthusiasm", "action", "purpose"],
    "amusement": ["joy", "lightness", "balance"],
    "relief": ["peace", "surrender", "trust"],
    "optimism": ["hope", "faith", "perseverance"],
    "caring": ["compassion", "service", "love"],
    "approval": ["acceptance", "harmony", "peace"],
    
    # Ambiguous emotions
    "desire": ["detachment", "contentment", "wisdom"],
    "realization": ["knowledge", "awakening", "truth"],
    "surprise": ["acceptance", "adaptability", "learning"],
}
```

## Usage in API Responses

Emotion data is returned in this format:

```json
{
  "emotions": [
    {
      "label": "gratitude",
      "confidence": 0.92,
      "emoji": "🙏",
      "color": "#FEF3C7"
    },
    {
      "label": "joy",
      "confidence": 0.45,
      "emoji": "😊",
      "color": "#FEF3C7"
    }
  ],
  "dominant": {
    "label": "gratitude",
    "confidence": 0.92,
    "emoji": "🙏",
    "color": "#FEF3C7"
  }
}
```

## Frontend Display

Colors are used for:
- **Background overlays** on emotion badges
- **Calendar day backgrounds** in mood tracker
- **Chart colors** in analytics dashboard
- **Dynamic theme overlays** (optional feature)

Emojis are displayed:
- **Next to messages** in chat interface
- **In calendar cells** for daily moods
- **In analytics charts** as data point markers
- **In emotion badges** throughout the UI
