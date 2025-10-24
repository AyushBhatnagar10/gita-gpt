import uuid
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from fastapi.testclient import TestClient
    from app.main import app
    
    client = TestClient(app)
except ImportError as e:
    print(f"Warning: Could not import required modules: {e}")
    print("This test requires FastAPI to be installed.")
    client = None


def test_chat_endpoint_basic():
    """Test the basic functionality of the chat endpoint."""
    
    if client is None:
        print("⚠️  Skipping test - FastAPI not available")
        return
    
    # Test data
    test_request = {
        "user_input": "I am feeling anxious about my work responsibilities",
        "user_id": str(uuid.uuid4()),
        "interaction_mode": "wisdom"
    }
    
    try:
        # Make request to chat endpoint
        response = client.post("/api/chat/", json=test_request)
        
        # Check response status
        if response.status_code != 200:
            print(f"❌ Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return
        
        # Check response structure
        data = response.json()
        required_fields = ["reflection", "emotion", "verses", "session_id", "interaction_mode", "fallback_used"]
        
        for field in required_fields:
            if field not in data:
                print(f"❌ Missing required field: {field}")
                return
        
        # Check emotion data structure
        emotion = data["emotion"]
        emotion_fields = ["label", "confidence", "emoji", "color"]
        
        for field in emotion_fields:
            if field not in emotion:
                print(f"❌ Missing emotion field: {field}")
                return
        
        # Check verses structure
        verses = data["verses"]
        if len(verses) == 0:
            print("❌ No verses returned")
            return
            
        verse = verses[0]
        verse_fields = ["id", "chapter", "verse", "shloka", "eng_meaning"]
        
        for field in verse_fields:
            if field not in verse:
                print(f"❌ Missing verse field: {field}")
                return
        
        # Check that reflection is not empty
        if len(data["reflection"]) == 0:
            print("❌ Empty reflection")
            return
        
        # Check that session_id is valid UUID
        try:
            uuid.UUID(data["session_id"])
        except ValueError:
            print("❌ Invalid session_id format")
            return
        
        print(f"✅ Chat endpoint test passed!")
        print(f"Detected emotion: {emotion['label']} ({emotion['confidence']:.2f})")
        print(f"Found {len(verses)} verses")
        print(f"Fallback used: {data['fallback_used']}")
        
    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()


def test_chat_endpoint_invalid_mode():
    """Test the chat endpoint with invalid interaction mode."""
    
    if client is None:
        print("⚠️  Skipping test - FastAPI not available")
        return
    
    test_request = {
        "user_input": "I am feeling good today",
        "user_id": str(uuid.uuid4()),
        "interaction_mode": "invalid_mode"
    }
    
    try:
        response = client.post("/api/chat/", json=test_request)
        
        # Should return 400 for invalid mode
        if response.status_code == 400 and "Invalid interaction mode" in response.json()["detail"]:
            print("✅ Invalid mode test passed!")
        else:
            print(f"❌ Expected 400 with invalid mode message, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ Invalid mode test failed: {e}")


def test_chat_endpoint_empty_input():
    """Test the chat endpoint with empty input."""
    
    if client is None:
        print("⚠️  Skipping test - FastAPI not available")
        return
    
    test_request = {
        "user_input": "",
        "user_id": str(uuid.uuid4()),
        "interaction_mode": "wisdom"
    }
    
    try:
        response = client.post("/api/chat/", json=test_request)
        
        # Should return 422 for validation error
        if response.status_code == 422:
            print("✅ Empty input validation test passed!")
        else:
            print(f"❌ Expected 422 for empty input, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ Empty input test failed: {e}")


def test_chat_endpoint_all_modes():
    """Test the chat endpoint with all interaction modes."""
    
    if client is None:
        print("⚠️  Skipping test - FastAPI not available")
        return
    
    modes = ["socratic", "wisdom", "story"]
    
    for mode in modes:
        try:
            test_request = {
                "user_input": f"I am seeking guidance in {mode} mode",
                "user_id": str(uuid.uuid4()),
                "interaction_mode": mode
            }
            
            response = client.post("/api/chat/", json=test_request)
            
            if response.status_code == 200:
                data = response.json()
                if data["interaction_mode"] == mode:
                    print(f"✅ {mode.capitalize()} mode test passed!")
                else:
                    print(f"❌ Mode mismatch for {mode}")
            else:
                print(f"❌ {mode} mode test failed with status {response.status_code}")
                
        except Exception as e:
            print(f"❌ {mode} mode test failed: {e}")


def test_chat_health_endpoint():
    """Test the chat service health endpoint."""
    
    if client is None:
        print("⚠️  Skipping test - FastAPI not available")
        return
    
    try:
        response = client.get("/api/chat/health")
        
        if response.status_code != 200:
            print(f"❌ Health endpoint returned {response.status_code}")
            return
        
        data = response.json()
        
        required_fields = ["status", "services", "message"]
        for field in required_fields:
            if field not in data:
                print(f"❌ Missing health field: {field}")
                return
        
        # Check that all required services are reported
        services = data["services"]
        expected_services = ["emotion_detection", "vector_search", "reflection_generation", "database"]
        
        for service in expected_services:
            if service not in services:
                print(f"❌ Missing service in health check: {service}")
                return
            if "status" not in services[service]:
                print(f"❌ Missing status for service: {service}")
                return
        
        print(f"✅ Chat health endpoint test passed!")
        print(f"Overall status: {data['status']}")
        
    except Exception as e:
        print(f"❌ Health endpoint test failed: {e}")


if __name__ == "__main__":
    # Run tests directly
    print("Running chat endpoint tests...")
    print("=" * 50)
    
    if client is None:
        print("❌ Cannot run tests - FastAPI dependencies not available")
        print("Please install the required packages from requirements.txt")
        sys.exit(1)
    
    test_chat_endpoint_basic()
    print()
    test_chat_endpoint_invalid_mode()
    print()
    test_chat_endpoint_empty_input()
    print()
    test_chat_endpoint_all_modes()
    print()
    test_chat_health_endpoint()
    
    print("\n🎉 All tests completed!")