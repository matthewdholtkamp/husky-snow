import time
from playwright.sync_api import sync_playwright

def test_full_game_flow():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Listen to console and errors
        page.on("console", lambda msg: print(f"CONSOLE: [{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        try:
            # 1. Navigate to the game
            print("Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000")
            
            # Wait for Connecting button to change to "Enter Lobby" or just wait
            page.wait_for_selector("button", timeout=5000)
            page.screenshot(path="verification/step1_landing.png")
            print("Step 1: Captured step1_landing.png")

            # Click the enter button
            page.click("button")
            time.sleep(1)

            # 2. In lobby, click "Create New Game"
            print("Creating a new game...")
            page.wait_for_selector("text=Create New Game", timeout=5000)
            page.click("text=Create New Game")
            time.sleep(2)

            # 3. Character Selection Screen
            print("Navigated to character selection...")
            page.wait_for_selector("text=Choose Your Pup", timeout=10000)
            page.screenshot(path="verification/step2_char_selection.png")
            print("Step 2: Captured step2_char_selection.png")

            # Click Shiver to choose character (first character card)
            page.click("text=Shiver")
            time.sleep(2)

            # 4. Gameplay Screen & Onboarding Tutorial Overlay
            print("Navigated to gameplay screen...")
            page.wait_for_selector("text=Welcome to Moonshine River", timeout=10000)
            page.screenshot(path="verification/step3_tutorial_overlay.png")
            print("Step 3: Captured step3_tutorial_overlay.png")

            # Progress through tutorial
            print("Clicking Next in tutorial...")
            page.click("button:has-text('Next')") # From Step 0 to Step 1
            page.wait_for_selector("text=Stats & Modifier Math", timeout=5000)
            
            print("Clicking Next again...")
            page.click("button:has-text('Next')") # From Step 1 to Step 2
            page.wait_for_selector("text=Cooperative Magic & Items", timeout=5000)

            print("Clicking Next a third time...")
            page.click("button:has-text('Next')") # From Step 2 to Step 3
            page.wait_for_selector("text=Practice Roll!", timeout=5000)

            # Step 4: Practice Roll Slide
            print("Rolling practice D20...")
            page.click("button:has-text('Roll Practice Dice')")
            page.wait_for_selector("text=You Rolled:", timeout=5000)
            page.screenshot(path="verification/step4_practice_roll.png")
            print("Step 4: Captured step4_practice_roll.png")

            # Click Start Adventure
            print("Entering adventure...")
            page.click("button:has-text('Start Adventure')")
            time.sleep(1.5)

            # 5. Active Gameplay screen
            page.screenshot(path="verification/step5_active_gameplay.png")
            print("Step 5: Captured step5_active_gameplay.png")

        except Exception as e:
            print(f"Error during test: {e}")
            page.screenshot(path="verification/step_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_full_game_flow()
