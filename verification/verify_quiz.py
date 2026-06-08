import time
from playwright.sync_api import sync_playwright

def test_quiz_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.on("console", lambda msg: print(f"CONSOLE: [{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        try:
            # 1. Navigate to the game
            print("Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000")
            
            # Click enter button to enter lobby
            page.wait_for_selector("button", timeout=5000)
            page.click("button")
            time.sleep(1)

            # In lobby, click "Create New Game"
            print("Creating a new game...")
            page.wait_for_selector("text=Create New Game", timeout=5000)
            page.click("text=Create New Game")
            time.sleep(2)

            # Character Selection Screen - Click Take Quiz
            print("Navigated to character selection. Triggering Quiz...")
            page.wait_for_selector("text=Choose Your Pup", timeout=10000)
            page.click("text=Find Your Match: Take the Pup Quiz!")
            time.sleep(1)

            # Capture Question screen
            page.screenshot(path="verification/quiz_question.png")
            print("Captured quiz_question.png")

            # Answer Question 1: Scout path
            page.click("text=scout the trail")
            time.sleep(0.5)

            # Answer Question 2: Ice Shields
            page.click("text=Ice Shields")
            time.sleep(0.5)

            # Answer Question 3: high window
            page.click("text=high window")
            time.sleep(0.5)

            # Answer Question 4: funny winter stories
            page.click("text=funny winter stories")
            time.sleep(1)

            # Capture Results Screen
            page.screenshot(path="verification/quiz_result.png")
            print("Captured quiz_result.png")

            # Click View All Pups to check the highlighted match card
            page.click("text=View All Pups")
            time.sleep(1)

            # Capture Selection screen with highlight
            page.screenshot(path="verification/quiz_match_highlight.png")
            print("Captured quiz_match_highlight.png")

        except Exception as e:
            print(f"Error during quiz test: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    test_quiz_flow()
