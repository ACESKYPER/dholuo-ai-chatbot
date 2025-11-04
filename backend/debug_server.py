from fastapi import FastAPI
import uvicorn
import sys
import traceback

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Test server running"}

if __name__ == "__main__":
    try:
        print("\nStarting minimal test server...")
        print("Python version:", sys.version)
        print("uvicorn version:", uvicorn.__version__)
        print("\nServer will be at: http://127.0.0.1:9000\n")
        
        # Set up event handlers to debug lifecycle
        async def on_startup():
            print("Server starting up...")
        
        async def on_shutdown():
            print("Server shutting down...")
            print("Shutdown stack trace:")
            traceback.print_stack()
        
        app.add_event_handler("startup", on_startup)
        app.add_event_handler("shutdown", on_shutdown)
        
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=9000,
            log_level="debug"
        )
    except Exception as e:
        print("\nFatal error:", e)
        print("\nFull traceback:")
        traceback.print_exc()
        sys.exit(1)