// Performance optimized matrix effect
      document.addEventListener("DOMContentLoaded", () => {
        const binaryOverlay = document.getElementById("binary-overlay");
        const container = document.querySelector(".matrix-container");
        const navbarBrand = document.querySelector(".navbar-brand");
        const toolButtons = document.querySelectorAll(".tool-button");

        // Improved stutter-proof navbar animations with simpler, non-bouncy animations
        function animateNavbar() {
          // First, reset any inline styles that might cause conflicts
          gsap.set([navbarBrand, toolButtons], { clearProps: "all" });

          // Remove the transform from CSS by setting it explicitly with GSAP
          // This avoids the conflict between CSS and GSAP animations
          toolButtons.forEach((button) => {
            button.style.transform = "translateY(10px)";
          });

          // Create a master timeline
          const masterTl = gsap.timeline();

          // Logo animation - simple fade in with no bounce
          const logoTl = gsap.timeline();
          logoTl
            .set(navbarBrand, {
              opacity: 0,
              y: -15,
            })
            .to(navbarBrand, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power1.out", // Simpler easing with no bounce
            })
            .to(
              navbarBrand,
              {
                textShadow:
                  "0 0 18px rgba(255, 140, 0, 0.8), 0 0 8px rgba(255, 120, 0, 0.6)", // Enhanced orange glow
                duration: 0.4,
                yoyo: true,
                repeat: 1,
              },
              "-=0.2"
            );

          // Buttons animation with staggered appearance - no bounce
          const buttonsTl = gsap.timeline();
          buttonsTl
            .set(toolButtons, {
              opacity: 0,
              y: 10,
            })
            .to(toolButtons, {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.4,
              ease: "power1.out", // Simple easing with no bounce
            });

          // Add both animations to the master timeline
          masterTl.add(logoTl);
          masterTl.add(buttonsTl, "-=0.3"); // Start buttons while logo is still animating
        }

        let lastX = 0,
          lastY = 0;
        let activeBits = new Map(); // Track only visible bits
        let allBits = [];
        let ticking = false;
        let mouseMoveTimeout = null;
        let isIdle = false;

        // Initialize binary overlay with optimized performance
        function initBinaryMatrix() {
          // Clear existing content
          binaryOverlay.innerHTML = "";
          activeBits.clear();
          allBits = [];

          // Get dimensions
          const width = window.innerWidth;
          const height = window.innerHeight;

          // Calculate density - less bits for better performance
          const binarySize = 30; // Increased for better performance
          const cols = Math.ceil(width / binarySize);
          const rows = Math.ceil(height / binarySize);

          // Create binary digits with absolute positioning for better rendering
          const fragment = document.createDocumentFragment();

          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
              const binaryBit = document.createElement("div");
              binaryBit.classList.add("binary-bit");
              binaryBit.textContent = Math.random() > 0.5 ? "1" : "0";

              // Use absolute positioning - significant performance boost
              binaryBit.style.left = col * binarySize + binarySize / 2 + "px";
              binaryBit.style.top = row * binarySize + binarySize / 2 + "px";

              // Store coordinates for faster distance calculation
              binaryBit.x = col * binarySize + binarySize / 2;
              binaryBit.y = row * binarySize + binarySize / 2;

              fragment.appendChild(binaryBit);
              allBits.push(binaryBit);
            }
          }

          binaryOverlay.appendChild(fragment);

          // Trigger navbar animation after matrix is initialized - start sooner
          setTimeout(animateNavbar, 200); // Quick start
        }

        // Initialize matrix
        initBinaryMatrix();

        // Handle window resize with debouncing
        let resizeTimer;
        window.addEventListener("resize", () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            initBinaryMatrix();
          }, 250); // Debounce resize events
        });

        // Add mouse movement tracking with throttling
        document.addEventListener("mousemove", (e) => {
          lastX = e.clientX;
          lastY = e.clientY;

          // Reset idle state when mouse moves
          isIdle = false;

          // Clear previous timeout
          if (mouseMoveTimeout) {
            clearTimeout(mouseMoveTimeout);
          }

          // Set timeout to fade out matrix after 3 seconds of no movement
          mouseMoveTimeout = setTimeout(() => {
            isIdle = true;
            fadeOutMatrix();
          }, 1500); // Changed from 3000 to 1500 milliseconds (1.5 seconds)

          if (!ticking) {
            window.requestAnimationFrame(() => {
              updateBinaryOverlay(lastX, lastY);
              ticking = false;
            });
            ticking = true;
          }
        });

        // Function to fade out matrix when idle
        function fadeOutMatrix() {
          if (!isIdle) return;

          // Gradually fade out all visible bits
          const visibleBits = allBits.filter(
            (bit) => bit.style.opacity !== "0"
          );

          if (visibleBits.length > 0) {
            // Use GSAP for smooth fade out
            gsap.to(visibleBits, {
              opacity: 0,
              duration: 1.5,
              ease: "power2.out",
              stagger: {
                from: "random",
                amount: 0.8,
              },
            });
          }
        }

        // Optimized update function
        function updateBinaryOverlay(x, y) {
          // If we're in idle state, cancel the update
          if (isIdle) return;

          const maxDistance = 100; // Increased from 120 to 180
          const innerRadius = 60; // Increased from 50 to 70

          // Only process bits that might be visible (optimization)
          const visibleArea = {
            left: x - maxDistance,
            right: x + maxDistance,
            top: y - maxDistance,
            bottom: y + maxDistance,
          };

          // Update active bits
          for (let i = 0; i < allBits.length; i++) {
            const bit = allBits[i];

            // Skip bits far outside the visible area
            if (
              bit.x < visibleArea.left ||
              bit.x > visibleArea.right ||
              bit.y < visibleArea.top ||
              bit.y > visibleArea.bottom
            ) {
              if (bit.style.opacity !== "0") {
                bit.style.opacity = "0";
              }
              continue;
            }

            // Fast distance calculation using pre-stored coordinates
            const dx = bit.x - x;
            const dy = bit.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < innerRadius) {
              // Reduced brightness inner circle
              bit.style.opacity = "1";
              bit.style.color = "rgba(255, 255, 255, 0.18)"; // Slightly increased brightness

              // Rarely change these binary values
              if (Math.random() > 0.93) {
                bit.textContent = Math.random() > 0.5 ? "1" : "0";
              }
            } else if (distance < maxDistance) {
              // Less visible outer ring with decreased brightness
              const opacity = 0.18 - (distance - innerRadius) / 400; // Increased base opacity

              if (opacity > 0.05) {
                bit.style.opacity = "1";
                bit.style.color = `rgba(255, 230, 190, ${opacity})`; /* Brighter orange tint */
              } else {
                bit.style.opacity = "0";
              }
            } else if (bit.style.opacity !== "0") {
              bit.style.opacity = "0";
            }
          }
        }
      });

      // Add this to the end of your script section

      // Terminal UI handling
      document.addEventListener("DOMContentLoaded", function () {
        // Animate terminal appearance
        const terminal = document.querySelector(".terminal-container");
        const textEncryptBtn = document.querySelectorAll(".tool-button")[0];
        const fileEncryptBtn = document.querySelectorAll(".tool-button")[1];
        const hashReverseBtn = document.querySelectorAll(".tool-button")[2];

        // Store the current terminal content for text encryption
        const textEncryptContent = `
          <div class="terminal-row">
            <label class="terminal-label">ALGORITHM:</label>
            <div class="terminal-select-wrapper">
              <select class="terminal-select" id="encryption-algorithm">
                <option value="aes">AES-256</option>
                <option value="caesar">Caesar Cipher</option>
                <option value="des" disabled>DES (Coming Soon)</option>
                <option value="rsa" disabled>RSA (Coming Soon)</option>
                <option value="blowfish" disabled>Blowfish (Coming Soon)</option>
              </select>
            </div>
          </div>
          <div class="terminal-row">
            <label class="terminal-label">KEY:</label>
            <div class="password-wrapper">
              <input
                type="password"
                class="terminal-input"
                id="encryption-key"
                placeholder="Enter encryption key..."
              />
              <button
                class="password-toggle"
                id="pwd-toggle"
                aria-label="Show/hide password"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>
          <div class="terminal-row input-area">
            <label class="terminal-label">INPUT:</label>
            <textarea
              class="terminal-textarea"
              id="input-text"
              placeholder="Enter text to encrypt..."
            ></textarea>
          </div>
          <div class="terminal-row">
            <button class="terminal-button" id="encrypt-btn">ENCRYPT</button>
            <button class="terminal-button" id="decrypt-btn">DECRYPT</button>
            <button class="terminal-button" id="clear-btn">CLEAR</button>
          </div>
          <div class="terminal-row output-area">
            <label class="terminal-label">OUTPUT:</label>
            <div style="position: relative; width: 100%">
              <div class="terminal-output" id="output-text"></div>
              <button 
                class="terminal-button" 
                id="copy-btn" 
                style="position: absolute; top: 6px; right: 6px; padding: 5px 8px; font-size: 11px; opacity: 0.8;"
              >
                COPY
              </button>
            </div>
          </div>
        `;

        // Replace the file encryption content structure in the script section
        const fileEncryptContent = `
          <div class="terminal-row">
            <label class="terminal-label">ALGORITHM:</label>
            <div class="terminal-select-wrapper">
              <select class="terminal-select" id="file-encryption-algorithm">
                <option value="aes">AES-256</option>
                <option value="pgp" disabled>PGP/GPG (Coming Soon)</option>
                <option value="zip" disabled>ZIP (AES) (Coming Soon)</option>
                <option value="7zip" disabled>7-Zip (AES) (Coming Soon)</option>
              </select>
            </div>
          </div>
          <div class="terminal-row">
            <label class="terminal-label">KEY:</label>
            <div class="password-wrapper">
              <input
                type="password"
                class="terminal-input"
                id="file-encryption-key"
                placeholder="Enter encryption key..."
              />
              <button
                class="password-toggle"
                id="file-pwd-toggle"
                aria-label="Show/hide password"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>
          <div class="terminal-row">
            <label class="terminal-label">FILE:</label>
            <div style="flex-grow: 1; display: flex; align-items: center; gap: 10px;">
              <input
                type="text"
                class="terminal-input"
                id="file-path"
                placeholder="Selected file path..."
                style="flex-grow: 1;"
              />
              <input type="file" id="file-input" style="display: none;" />
              <button class="terminal-button" id="browse-btn">BROWSE</button>
            </div>
          </div>
          <div class="terminal-row" style="justify-content: flex-start; gap: 10px;">
            <button class="terminal-button" id="file-encrypt-btn">ENCRYPT</button>
            <button class="terminal-button" id="file-decrypt-btn">DECRYPT</button>
            <button class="terminal-button" id="file-clear-btn">CLEAR</button>
          </div>
          <div class="terminal-row output-area" style="display: block;">
            <label class="terminal-label">STATUS:</label>
            <div class="terminal-output" id="file-output-text" style="max-height: 120px; width: 100%;"></div>
            <button class="terminal-button" id="file-download-btn" style="display: none; background-color: rgba(20, 40, 20, 0.8); width: 100%; margin-top: 10px;">DOWNLOAD FILE</button>
          </div>
        `;

        // Create hash reverse content
        const hashReverseContent = `
          <div class="terminal-row">
            <label class="terminal-label">HASH TYPE:</label>
            <div class="terminal-select-wrapper">
              <select class="terminal-select" id="hash-type">
                <option value="md5">MD5</option>
                <option value="sha1">SHA1</option>
                <option value="sha256">SHA256</option>
                <option value="ntlm" disabled>NTLM (Coming Soon)</option>
                <option value="bcrypt" disabled>bcrypt (Coming Soon)</option>
              </select>
            </div>
          </div>
          <div class="terminal-row input-area">
            <label class="terminal-label">HASH INPUT:</label>
            <textarea
              class="terminal-textarea"
              id="hash-input"
              placeholder="Enter hash to crack..."></textarea>
          </div>
          <div class="terminal-row">
            <label class="terminal-label">DICTIONARY:</label>
            <div style="flex-grow: 1; display: flex; align-items: center; gap: 10px;">
              <input
                type="text"
                class="terminal-input"
                id="dictionary-path"
                placeholder="Selected dictionary file or wordlist..."
                style="flex-grow: 1;"
              />
              <input type="file" id="dictionary-file" style="display: none;" />
              <button class="terminal-button" id="browse-dict-btn">BROWSE</button>
            </div>
          </div>
          <div class="terminal-row" style="justify-content: flex-start; gap: 10px;">
            <button class="terminal-button" id="crack-btn">CRACK HASH</button>
            <button class="terminal-button" id="hash-clear-btn">CLEAR</button>
          </div>
          <div class="terminal-row output-area">
            <label class="terminal-label">RESULT:</label>
            <div class="terminal-output" id="hash-output"></div>
          </div>
        `;

        // Add terminal animation with delay after matrix effect initializes
        setTimeout(() => {
          gsap.fromTo(
            terminal,
            { opacity: 0, y: -20, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power2.out",
            }
          );
        }, 1000);

        // Button handlers for switching interfaces
        textEncryptBtn.addEventListener("click", () => {
          gsap.to(".terminal-content", {
            opacity: 0,
            y: 10,
            duration: 0.3,
            onComplete: () => {
              document.querySelector(".terminal-content").innerHTML =
                textEncryptContent;
              document.querySelector(".terminal-title").textContent =
                "TEXT ENCRYPTION TERMINAL";

              // Reinitialize event listeners for the text encryption interface
              initTextEncryptListeners();

              gsap.fromTo(
                ".terminal-content",
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3 }
              );
            },
          });
        });

        fileEncryptBtn.addEventListener("click", () => {
          gsap.to(".terminal-content", {
            opacity: 0,
            y: 10,
            duration: 0.3,
            onComplete: () => {
              document.querySelector(".terminal-content").innerHTML =
                fileEncryptContent;
              document.querySelector(".terminal-title").textContent =
                "FILE ENCRYPTION TERMINAL";

              // Initialize event listeners for file encryption interface
              initFileEncryptListeners();

              gsap.fromTo(
                ".terminal-content",
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3 }
              );
            },
          });
        });

        hashReverseBtn.addEventListener("click", () => {
          gsap.to(".terminal-content", {
            opacity: 0,
            y: 10,
            duration: 0.3,
            onComplete: () => {
              document.querySelector(".terminal-content").innerHTML =
                hashReverseContent;
              document.querySelector(".terminal-title").textContent =
                "HASH REVERSE TERMINAL";

              // Initialize event listeners for hash reverse interface
              initHashReverseListeners();

              gsap.fromTo(
                ".terminal-content",
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3 }
              );
            },
          });
        });

        // Modified mockEncrypt function with Caesar cipher validation
        function mockEncrypt(text, algorithm, key) {
          if (!text) return "ERROR: No input text provided";
          if (!key) return "ERROR: Encryption key required";

          // Simple encoding for demonstration
          let result = "";
          switch (algorithm) {
            case "aes":
              result = btoa(text) + ".AES256";
              break;
            case "des":
              result = btoa(text) + ".DES";
              break;
            case "rsa":
              result = btoa(text) + ".RSA";
              break;
            case "blowfish":
              result = btoa(text) + ".BLOWFISH";
              break;
            case "caesar":
              // Validate Caesar cipher key
              const shift = parseInt(key);
              if (isNaN(shift) || shift < 0 || shift > 25) {
                return "ERROR: Caesar cipher key must be a number between 0 and 25";
              }

              // Simple Caesar cipher
              result = text
                .split("")
                .map((char) => {
                  if (char.match(/[a-z]/i)) {
                    const code = char.charCodeAt(0);
                    const isUpperCase = code >= 65 && code <= 90;
                    const offset = isUpperCase ? 65 : 97;
                    return String.fromCharCode(
                      ((code - offset + shift) % 26) + offset
                    );
                  }
                  return char;
                })
                .join("");
              result += ".CAESAR";
              break;
            default:
              result = btoa(text);
          }
          return result;
        }

        // Modified mockDecrypt function with Caesar cipher validation
        function mockDecrypt(text, algorithm, key) {
          if (!text) return "ERROR: No input text provided";
          if (!key) return "ERROR: Decryption key required";

          // Simple decoding for demonstration
          let result = "";
          try {
            if (algorithm === "caesar") {
              // Validate Caesar cipher key
              const shift = parseInt(key);
              if (isNaN(shift) || shift < 0 || shift > 25) {
                return "ERROR: Caesar cipher key must be a number between 0 and 25";
              }

              // Simple Caesar cipher decryption
              result = text
                .replace(".CAESAR", "")
                .split("")
                .map((char) => {
                  if (char.match(/[a-z]/i)) {
                    const code = char.charCodeAt(0);
                    const isUpperCase = code >= 65 && code <= 90;
                    const offset = isUpperCase ? 65 : 97;
                    return String.fromCharCode(
                      ((code - offset - shift + 26) % 26) + offset
                    );
                  }
                  return char;
                })
                .join("");
            } else {
              // Remove the algorithm suffix if present
              let cleanText = text;
              [".AES256", ".DES", ".RSA", ".BLOWFISH"].forEach((suffix) => {
                cleanText = cleanText.replace(suffix, "");
              });
              result = atob(cleanText);
            }
          } catch (e) {
            return "ERROR: Invalid input format or corrupted data";
          }
          return result;
        }

        // Initialize text encryption listeners
        function initTextEncryptListeners() {
          const encryptBtn = document.getElementById("encrypt-btn");
          const decryptBtn = document.getElementById("decrypt-btn");
          const clearBtn = document.getElementById("clear-btn");
          const inputText = document.getElementById("input-text");
          const outputText = document.getElementById("output-text");
          const encryptionAlgo = document.getElementById(
            "encryption-algorithm"
          );
          const encryptionKey = document.getElementById("encryption-key");
          const pwdToggle = document.getElementById("pwd-toggle");
          const copyBtn = document.getElementById("copy-btn");

          // Add copy button functionality
          if (copyBtn) {
            copyBtn.addEventListener("click", () => {
              if (outputText.textContent) {
                // Create a temporary textarea to copy the content
                const tempTextArea = document.createElement("textarea");
                tempTextArea.value = outputText.textContent;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand("copy");
                document.body.removeChild(tempTextArea);

                // Visual feedback for the copy action
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "COPIED!";
                copyBtn.style.backgroundColor = "rgba(20, 40, 20, 0.7)";

                // Reset button after 1.5 seconds
                setTimeout(() => {
                  copyBtn.textContent = originalText;
                  copyBtn.style.backgroundColor = "";
                }, 1500);
              }
            });
          }

          // Add password toggle functionality
          pwdToggle.addEventListener("click", () => {
            // Toggle between password and text type
            const type =
              encryptionKey.getAttribute("type") === "password"
                ? "text"
                : "password";
            encryptionKey.setAttribute("type", type);

            // Update the eye icon (open eye when showing password, closed eye when hiding)
            if (type === "password") {
              pwdToggle.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>`;
            } else {
              pwdToggle.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2"></line>
                </svg>`;
            }
          });

          // Event listeners for buttons
          encryptBtn.addEventListener("click", () => {
            const text = inputText.value;
            const algo = encryptionAlgo.value;
            const key = encryptionKey.value;

            const encrypted = mockEncrypt(text, algo, key);
            outputText.textContent = encrypted;

            // Animate the output appearance
            gsap.fromTo(
              outputText,
              { backgroundColor: "rgba(25, 15, 0, 0.5)" },
              { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.5 }
            );
          });

          decryptBtn.addEventListener("click", () => {
            const text = inputText.value;
            const algo = encryptionAlgo.value;
            const key = encryptionKey.value;

            const decrypted = mockDecrypt(text, algo, key);
            outputText.textContent = decrypted;

            // Animate the output appearance
            gsap.fromTo(
              outputText,
              { backgroundColor: "rgba(0, 25, 5, 0.5)" },
              { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.5 }
            );
          });

          clearBtn.addEventListener("click", () => {
            inputText.value = "";
            outputText.textContent = "";
          });

          // Handle algorithm change - adjust key placeholder for better UX
          encryptionAlgo.addEventListener("change", () => {
            const algo = encryptionAlgo.value;
            switch (algo) {
              case "aes":
                encryptionKey.placeholder = "Enter 32-byte AES key...";
                break;
              case "des":
                encryptionKey.placeholder = "Enter 8-byte DES key...";
                break;
              case "rsa":
                encryptionKey.placeholder = "Enter RSA private/public key...";
                break;
              case "blowfish":
                encryptionKey.placeholder = "Enter Blowfish key...";
                break;
              case "caesar":
                encryptionKey.placeholder = "Enter shift value (0-25)...";
                break;
            }
          });

          // Trigger change event to set initial placeholder
          encryptionAlgo.dispatchEvent(new Event("change"));
        }

        // Initialize file encryption listeners
        function initFileEncryptListeners() {
          const fileEncryptBtn = document.getElementById("file-encrypt-btn");
          const fileDecryptBtn = document.getElementById("file-decrypt-btn");
          const fileClearBtn = document.getElementById("file-clear-btn");
          const browseBtn = document.getElementById("browse-btn");
          const filePath = document.getElementById("file-path");
          const fileInput = document.getElementById("file-input");
          const outputText = document.getElementById("file-output-text");
          const encryptionAlgo = document.getElementById(
            "file-encryption-algorithm"
          );
          const encryptionKey = document.getElementById("file-encryption-key");
          const pwdToggle = document.getElementById("file-pwd-toggle");

          // Add password toggle functionality for file encryption
          if (pwdToggle) {
            pwdToggle.addEventListener("click", function () {
              // Toggle between password and text type
              const type =
                encryptionKey.getAttribute("type") === "password"
                  ? "text"
                  : "password";
              encryptionKey.setAttribute("type", type);

              // Update the SVG icon based on the current state
              if (type === "password") {
                // Show the eye icon (password is hidden)
                this.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>`;
              } else {
                // Show the crossed eye icon (password is visible)
                this.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2"></line>
                  </svg>`;
              }
            });
          }

          // Browse button opens file dialog
          browseBtn.addEventListener("click", () => {
            fileInput.click();
          });

          // Handle file selection
          fileInput.addEventListener("change", function (e) {
            if (this.files && this.files.length > 0) {
              const file = this.files[0];
              filePath.value = file.name;

              // Check if file is larger than 50MB (for demo purposes)
              const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
              if (file.size > MAX_FILE_SIZE) {
                outputText.textContent =
                  `WARNING: File size (${formatFileSize(
                    file.size
                  )}) exceeds 50MB.\n` +
                  `Large files may cause browser performance issues in this demo.\n` +
                  `Consider using a smaller file for testing purposes.`;

                // Highlight warning with animation
                gsap.fromTo(
                  outputText,
                  { backgroundColor: "rgba(50, 30, 0, 0.4)" },
                  { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 1.5 }
                );
              } else {
                // Show file details
                outputText.textContent = `File selected: ${
                  file.name
                }\nSize: ${formatFileSize(file.size)}\nModified: ${formatDate(
                  file.lastModified
                )}\nType: ${file.type || "Unknown"}`;

                // Add subtle highlight animation to the file path
                gsap.fromTo(
                  filePath,
                  { backgroundColor: "rgba(25, 15, 0, 0.4)" },
                  { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 1 }
                );
              }
            }
          });

          // Manually entered file path
          filePath.addEventListener("input", function () {
            // Enable direct file path entry
            if (filePath.value) {
              outputText.textContent = `Manual path entered: ${filePath.value}\nWarning: Manual paths require file availability`;
            }
          });

          // Clear button functionality
          fileClearBtn.addEventListener("click", () => {
            // Clear form fields
            filePath.value = "";
            encryptionKey.value = "";
            outputText.textContent = "";
            fileInput.value = "";

            // Remove progress bar if it exists
            const progressContainer =
              document.getElementById("progress-container");
            if (progressContainer) {
              progressContainer.remove();
            }

            // Hide download button
            const downloadBtn = document.getElementById("file-download-btn");
            if (downloadBtn) {
              downloadBtn.style.display = "none";
            }
          });

          // File encrypt button with animated progress
          fileEncryptBtn.addEventListener("click", () => {
            // Reset download button
            const downloadBtn = document.getElementById("file-download-btn");
            downloadBtn.style.display = "none";

            const file = filePath.value;
            const algo = encryptionAlgo.value;
            const key = encryptionKey.value;

            if (!file) {
              outputText.textContent = "ERROR: No file selected";
              gsap.fromTo(
                outputText,
                { backgroundColor: "rgba(50, 0, 0, 0.4)" },
                { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.5 }
              );
              return;
            }

            if (!key) {
              outputText.textContent = "ERROR: Encryption key required";
              gsap.fromTo(
                outputText,
                { backgroundColor: "rgba(50, 0, 0, 0.4)" },
                { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.5 }
              );
              return;
            }

            // Check key complexity
            if (key.length < 8) {
              outputText.textContent =
                "ERROR: Key must be at least 8 characters";
              gsap.fromTo(
                outputText,
                { backgroundColor: "rgba(50, 0, 0, 0.4)" },
                { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.5 }
              );
              return;
            }

            // Get file info
            const fileName = file.includes("\\")
              ? file.split("\\").pop()
              : file;
            const isFileInput = fileInput.files && fileInput.files.length > 0;
            const selectedFile = isFileInput ? fileInput.files[0] : null;

            // Show compact initial status
            outputText.textContent = `Encrypting: ${fileName} (AES-256)`;

            if (selectedFile) {
              outputText.textContent += `\nSize: ${formatFileSize(
                selectedFile.size
              )}`;
            }

            // Create algorithm-specific progress messages - shorter for space
            const progressUpdates = getProgressMessages("aes", "encrypt");

            // Simulate encryption process
            simulateFileOperation(
              outputText,
              progressUpdates,
              algo,
              fileName,
              "encrypt"
            );
          });

          // File decrypt button with animated progress
          fileDecryptBtn.addEventListener("click", () => {
            // Reset download button
            const downloadBtn = document.getElementById("file-download-btn");
            downloadBtn.style.display = "none";

            const file = filePath.value;
            const algo = encryptionAlgo.value;
            const key = encryptionKey.value;

            if (!file) {
              outputText.textContent = "ERROR: No file selected";
              gsap.fromTo(
                outputText,
                { backgroundColor: "rgba(50, 0, 0, 0.4)" },
                { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.5 }
              );
              return;
            }

            if (!key) {
              outputText.textContent = "ERROR: Decryption key required";
              gsap.fromTo(
                outputText,
                { backgroundColor: "rgba(50, 0, 0, 0.4)" },
                { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.5 }
              );
              return;
            }

            // Get file info
            const fileName = file.includes("\\")
              ? file.split("\\").pop()
              : file;

            // Show warning if file doesn't appear to have expected extension
            const expectedExt = getEncryptedExtension(algo);
            if (!fileName.toLowerCase().endsWith(expectedExt)) {
              outputText.textContent = `Warning: File may not be encrypted. Attempting decryption...`;
              setTimeout(() => {
                runDecryption();
              }, 800);
            } else {
              runDecryption();
            }

            function runDecryption() {
              // Show compact initial status
              outputText.textContent = `Decrypting: ${fileName}`;

              // Create algorithm-specific progress messages
              const progressUpdates = getProgressMessages("aes", "decrypt");

              // Simulate decryption process
              simulateFileOperation(
                outputText,
                progressUpdates,
                algo,
                fileName,
                "decrypt"
              );
            }
          });

          // Handle algorithm change - adjust key placeholder and instructions
          encryptionAlgo.addEventListener("change", () => {
            const algo = encryptionAlgo.value;
            switch (algo) {
              case "aes":
                encryptionKey.placeholder = "Enter AES password (min. 8 chars)";
                outputText.textContent =
                  "AES-256 selected: Military-grade encryption for files";
                break;
              case "pgp":
                encryptionKey.placeholder = "Enter PGP passphrase";
                outputText.textContent =
                  "PGP/GPG selected: Public-key cryptography for secure file sharing";
                break;
              case "zip":
                encryptionKey.placeholder = "Enter ZIP password";
                outputText.textContent =
                  "ZIP (AES) selected: Password-protected compressed archives";
                break;
              case "7zip":
                encryptionKey.placeholder = "Enter 7-Zip password";
                outputText.textContent =
                  "7-Zip (AES) selected: Strong encrypted compressed archives";
                break;
            }
          });

          // Trigger change event to set initial placeholder
          encryptionAlgo.dispatchEvent(new Event("change"));

          // Helper functions for file operations

          // Format file size in human-readable form
          function formatFileSize(bytes) {
            if (bytes === 0) return "0 Bytes";
            const k = 1024;
            const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (
              parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
            );
          }

          // Format date from timestamp
          function formatDate(timestamp) {
            const date = new Date(timestamp);
            return date.toISOString().split("T")[0];
          }

          // Get expected file extension for encrypted files
          function getEncryptedExtension(algo) {
            switch (algo) {
              case "aes":
                return ".aes";
              case "pgp":
                return ".gpg";
              case "zip":
                return ".zip";
              case "7zip":
                return ".7z";
              default:
                return ".enc";
            }
          }

          // Get algorithm-specific progress messages
          function getProgressMessages(algo, operation) {
            const common = [
              { time: 800, message: "Reading file data..." },
              { time: 1500, message: "Processing file structure..." },
            ];

            const specificMessages = {
              aes: {
                encrypt: [
                  {
                    time: 1800,
                    message: "Generating initialization vector...",
                  },
                  { time: 2200, message: "Deriving key using PBKDF2..." },
                  { time: 2800, message: "Applying AES-256 cipher..." },
                  { time: 3500, message: "Generating authentication tag..." },
                  { time: 4000, message: "Finalizing encrypted container..." },
                ],
                decrypt: [
                  {
                    time: 1800,
                    message: "Extracting initialization vector...",
                  },
                  { time: 2200, message: "Deriving key using PBKDF2..." },
                  { time: 2800, message: "Verifying authentication tag..." },
                  { time: 3500, message: "Applying AES-256 decipher..." },
                  { time: 4000, message: "Restoring original file data..." },
                ],
              },
              pgp: {
                encrypt: [
                  { time: 1800, message: "Generating random session key..." },
                  {
                    time: 2300,
                    message: "Encrypting data with session key...",
                  },
                  {
                    time: 2900,
                    message: "Encrypting session key with public key...",
                  },
                  { time: 3400, message: "Adding recipient information..." },
                  { time: 4000, message: "Creating PGP message packet..." },
                ],
                decrypt: [
                  { time: 1800, message: "Verifying PGP message structure..." },
                  {
                    time: 2300,
                    message: "Decrypting session key with private key...",
                  },
                  { time: 2900, message: "Validating sender information..." },
                  {
                    time: 3400,
                    message: "Decrypting data with session key...",
                  },
                  { time: 4000, message: "Verifying message integrity..." },
                ],
              },
              zip: {
                encrypt: [
                  { time: 1800, message: "Analyzing file for compression..." },
                  { time: 2300, message: "Compressing data..." },
                  {
                    time: 2900,
                    message: "Applying AES encryption to archive...",
                  },
                  { time: 3400, message: "Creating ZIP central directory..." },
                  { time: 4000, message: "Finalizing encrypted archive..." },
                ],
                decrypt: [
                  { time: 1800, message: "Reading ZIP central directory..." },
                  { time: 2300, message: "Verifying password..." },
                  { time: 2900, message: "Decrypting archive data..." },
                  { time: 3400, message: "Decompressing content..." },
                  { time: 4000, message: "Restoring original files..." },
                ],
              },
              "7zip": {
                encrypt: [
                  {
                    time: 1800,
                    message: "Analyzing file for optimal compression...",
                  },
                  { time: 2300, message: "Applying LZMA2 compression..." },
                  { time: 2900, message: "Encrypting headers with AES-256..." },
                  { time: 3400, message: "Encrypting file data..." },
                  { time: 4000, message: "Creating 7z container structure..." },
                ],
                decrypt: [
                  { time: 1800, message: "Reading 7z container structure..." },
                  { time: 2300, message: "Decrypting headers..." },
                  { time: 2900, message: "Verifying archive integrity..." },
                  { time: 3400, message: "Decrypting file data..." },
                  { time: 4000, message: "Performing LZMA2 decompression..." },
                ],
              },
            };

            return [...common, ...specificMessages[algo][operation]];
          }

          // Simulate file encryption/decryption with realistic progress
          function simulateFileOperation(
            outputElement,
            progressSteps,
            algorithm,
            filename,
            operation
          ) {
            // Clear any existing progress bar and status elements
            const existingProgressBar =
              document.getElementById("progress-container");
            if (existingProgressBar) existingProgressBar.remove();

            // Create progress bar container
            const progressContainer = document.createElement("div");
            progressContainer.id = "progress-container";
            progressContainer.style.marginTop = "10px";
            progressContainer.style.width = "100%";
            progressContainer.style.marginBottom = "10px";

            // Create status text that will change during the operation
            const statusText = document.createElement("div");
            statusText.className = "status-text";
            statusText.style.fontFamily = '"Antikor Mono", Courier, monospace';
            statusText.style.color = "rgba(255, 180, 0, 0.95)";
            statusText.style.marginBottom = "5px";
            statusText.style.fontSize = "12px";
            statusText.textContent = "Initializing...";

            // Create progress bar
            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar-container";
            progressBar.style.width = "100%";
            progressBar.style.height = "8px";
            progressBar.style.backgroundColor = "rgba(30, 30, 30, 0.6)";
            progressBar.style.borderRadius = "4px";
            progressBar.style.overflow = "hidden";
            progressBar.style.border = "1px solid rgba(255, 140, 0, 0.3)";

            const progressFill = document.createElement("div");
            progressFill.className = "progress-bar-fill";
            progressFill.style.height = "100%";
            progressFill.style.width = "0%";
            progressFill.style.backgroundColor = "rgba(255, 140, 0, 0.5)";
            progressFill.style.transition = "width 0.3s ease-in-out";
            progressFill.style.boxShadow = "0 0 8px rgba(255, 140, 0, 0.4)";

            // Add everything to the DOM
            progressBar.appendChild(progressFill);
            progressContainer.appendChild(statusText);
            progressContainer.appendChild(progressBar);
            outputElement.insertAdjacentElement("afterend", progressContainer);

            // Show download button (hidden initially)
            const downloadButton = document.getElementById("file-download-btn");

            // Store the original text
            let originalText = outputElement.textContent;

            // Start at 0% progress
            let progress = 0;
            const totalSteps = progressSteps.length;
            let i = 0;

            // File data processing
            const encryptionKey = document.getElementById(
              operation === "encrypt"
                ? "file-encryption-key"
                : "file-encryption-key"
            ).value;

            // Get file from input if available
            let fileToProcess = null;
            if (fileInput.files && fileInput.files.length > 0) {
              fileToProcess = fileInput.files[0];
            }

            // Function for typing animation on status text (shorter text for space)
            function typeText(element, text, callback) {
              element.textContent = text; // Simplified - no typing animation for space efficiency
              if (callback) setTimeout(callback, 100);
            }

            function showNextUpdate() {
              if (i < progressSteps.length) {
                const update = progressSteps[i];

                // Update progress bar
                progress = ((i + 1) / totalSteps) * 100;
                progressFill.style.width = `${progress}%`;

                // Set status text directly - no typing animation for space efficiency
                statusText.textContent = update.message;

                // Log progress in output but keep it minimal
                if (i === 0) {
                  outputElement.textContent = originalText;
                }

                i++;
                setTimeout(showNextUpdate, update.time / 2); // Speed up for better UX
              } else {
                // All updates complete - 100% progress
                progressFill.style.width = "100%";
                progressFill.style.backgroundColor = "rgba(50, 200, 50, 0.7)";
                statusText.textContent = "Operation completed successfully!";

                // After completion, process the file
                setTimeout(() => {
                  processFileContent(
                    operation,
                    algorithm,
                    filename,
                    encryptionKey
                  );
                }, 300);
              }
            }

            function processFileContent(operation, algorithm, filename, key) {
              const isEncrypt = operation === "encrypt";
              const extension = getEncryptedExtension(algorithm);

              // Determine output filename based on operation
              let outputFilename;
              if (isEncrypt) {
                outputFilename = filename.toLowerCase().endsWith(extension)
                  ? filename
                  : filename + extension;
              } else {
                outputFilename = filename.toLowerCase().endsWith(extension)
                  ? filename.substring(0, filename.length - extension.length)
                  : filename + ".decrypted";
              }

              // Process the file content
              if (fileToProcess) {
                const reader = new FileReader();
                reader.onload = function (e) {
                  const fileContent = e.target.result;

                  // Actually encrypt/decrypt the file content
                  const processedContent = performCryptoOperation(
                    fileContent,
                    algorithm,
                    key,
                    isEncrypt
                  );

                  completeOperation(
                    operation,
                    algorithm,
                    outputFilename,
                    processedContent
                  );
                };

                // Read file as array buffer (works with any file type)
                reader.readAsArrayBuffer(fileToProcess);
              } else {
                // No real file, create a demo file with "encrypted" content
                const dummyContent = `This is a sample file to demonstrate ${operation}.
              Original filename: ${filename}
              Algorithm: ${algorithm.toUpperCase()}
              Generated: ${new Date().toISOString()}`;

                const processedContent = performCryptoOperation(
                  dummyContent,
                  algorithm,
                  key,
                  isEncrypt
                );

                completeOperation(
                  operation,
                  algorithm,
                  outputFilename,
                  processedContent
                );
              }
            }

            // Function that actually performs encryption/decryption
            function performCryptoOperation(
              content,
              algorithm,
              key,
              isEncrypt
            ) {
              // For binary content (ArrayBuffer)
              if (content instanceof ArrayBuffer) {
                // Convert ArrayBuffer to string for demonstration
                const view = new Uint8Array(content);
                let string = "";
                for (let i = 0; i < view.length; i++) {
                  string += String.fromCharCode(view[i]);
                }

                // Process the string content
                const processed = processStringContent(
                  string,
                  algorithm,
                  key,
                  isEncrypt
                );

                // Convert back to ArrayBuffer
                const buffer = new ArrayBuffer(processed.length);
                const bufView = new Uint8Array(buffer);
                for (let i = 0; i < processed.length; i++) {
                  bufView[i] = processed.charCodeAt(i);
                }
                return buffer;
              }
              // For string content
              else {
                return processStringContent(content, algorithm, key, isEncrypt);
              }
            }

            // Process string content based on algorithm
            function processStringContent(content, algorithm, key, isEncrypt) {
              // Since we're temporarily disabling other algorithms, just use AES
              return simulateAES(content, key, isEncrypt);
            }

            // Simple XOR encryption/decryption (works both ways)
            function xorEncryptDecrypt(text, key) {
              let result = "";
              for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(
                  text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
              }
              return result;
            }

            // Simulate AES encryption/decryption
            function simulateAES(text, key, isEncrypt) {
              if (isEncrypt) {
                // Add a simple header to identify as AES
                const header = "AES256:";
                // Simple encryption - in reality you'd use a proper AES implementation
                return header + btoa(xorEncryptDecrypt(text, key));
              } else {
                // Remove the header and decrypt
                if (text.startsWith("AES256:")) {
                  const ciphertext = text.substring(7);
                  try {
                    return xorEncryptDecrypt(atob(ciphertext), key);
                  } catch (e) {
                    return "Error: Invalid encryption format or wrong key";
                  }
                } else {
                  return "Error: Not an AES encrypted file";
                }
              }
            }

            function completeOperation(
              type,
              algo,
              outputFilename,
              processedContent
            ) {
              const isEncrypt = type === "encrypt";

              // Update the output text with minimal information to save space
              const finalMessage = `\n✓ ${
                isEncrypt ? "ENCRYPTED" : "DECRYPTED"
              }: ${outputFilename}`;
              outputElement.textContent += finalMessage;

              // Flash the output to indicate completion
              gsap.fromTo(
                outputElement,
                { backgroundColor: "rgba(0, 40, 0, 0.4)" },
                { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.8 }
              );

              // Update file path to show result filename
              filePath.value = outputFilename;

              // Create a Blob with the processed content
              let contentBlob;
              if (processedContent instanceof ArrayBuffer) {
                contentBlob = new Blob([processedContent], {
                  type: "application/octet-stream",
                });
              } else {
                contentBlob = new Blob([processedContent], {
                  type: "text/plain",
                });
              }

              // Update download button
              const downloadBtn = document.getElementById("file-download-btn");

              // Move the download button to appear after the progress container
              const progressContainer =
                document.getElementById("progress-container");
              if (progressContainer && progressContainer.parentNode) {
                // Remove download button from current position
                if (downloadBtn.parentNode) {
                  downloadBtn.parentNode.removeChild(downloadBtn);
                }

                // Insert after progress container
                progressContainer.parentNode.insertBefore(
                  downloadBtn,
                  progressContainer.nextSibling
                );
              }

              downloadBtn.textContent = `DOWNLOAD ${
                isEncrypt ? "ENCRYPTED" : "DECRYPTED"
              } FILE`;
              downloadBtn.style.display = "inline-block";
              downloadBtn.style.width = "100%"; // Make button full width
              downloadBtn.style.marginTop = "10px"; // Add some spacing

              // Create object URL for download
              const downloadUrl = URL.createObjectURL(contentBlob);
              downloadBtn.onclick = function () {
                // Simulate click with visual feedback
                gsap.to(downloadBtn, {
                  backgroundColor: "rgba(40, 80, 40, 0.8)",
                  scale: 1.05,
                  duration: 0.2,
                  onComplete: () => {
                    // Create temporary invisible link to trigger download
                    const tempLink = document.createElement("a");
                    tempLink.href = downloadUrl;
                    tempLink.download = outputFilename;
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);

                    // Animate button back to normal
                    gsap.to(downloadBtn, {
                      backgroundColor: "rgba(20, 40, 20, 0.8)",
                      scale: 1,
                      duration: 0.2,
                    });
                  },
                });
              };

              // Auto-highlight the button to draw attention
              gsap.fromTo(
                downloadBtn,
                { backgroundColor: "rgba(40, 80, 40, 0.8)", scale: 1.05 },
                {
                  backgroundColor: "rgba(20, 40, 20, 0.8)",
                  scale: 1,
                  duration: 0.7,
                  delay: 0.3,
                }
              );
            }

            // Start the progress updates with a short delay
            setTimeout(showNextUpdate, 400);
          }

          // If you're using a selected file, we should keep its contents
          function processFileForEncryption(file, algorithm, key) {
            return new Promise((resolve) => {
              const reader = new FileReader();

              reader.onload = function (event) {
                // In a real app, we would encrypt the file content here
                // For the demo, we'll just use the original content
                const fileContent = event.target.result;
                resolve(fileContent);
              };

              // Read the file as ArrayBuffer - works with any file type
              reader.readAsArrayBuffer(file);
            });
          }

          // Add this function to support real files if available
          function getFileContentForOperation(
            fileInput,
            file,
            algorithm,
            key,
            operation
          ) {
            if (fileInput.files && fileInput.files.length > 0) {
              const selectedFile = fileInput.files[0];
              // Process actual file if available
              return processFileForEncryption(selectedFile, algorithm, key);
            } else {
              // Create dummy content for demonstration
              return Promise.resolve(
                new Blob(
                  [
                    `This is a simulated ${
                      operation === "encrypt" ? "encrypted" : "decrypted"
                    } file.
                Algorithm: ${algorithm.toUpperCase()}
                Original filename: ${file}
                Generated on: ${new Date().toISOString()}
                
                This file was created as part of the En.crypt demonstration.`,
                  ],
                  { type: "text/plain" }
                )
              );
            }
          }

          // Helper function to clean up previous download buttons
          function clearDownloadButtons() {
            const downloadRows = document.querySelectorAll(".terminal-row");
            downloadRows.forEach((row) => {
              if (row.querySelector("a.terminal-button")) {
                row.remove();
              }
            });

            // Also clear any existing progress bars
            const progressContainer =
              document.getElementById("progress-container");
            if (progressContainer) {
              progressContainer.remove();
            }
          }
        }

        // Initialize hash reverse listeners
        function initHashReverseListeners() {
          const crackBtn = document.getElementById("crack-btn");
          const clearBtn = document.getElementById("hash-clear-btn");
          const browseBtn = document.getElementById("browse-dict-btn");
          const hashInput = document.getElementById("hash-input");
          const dictPath = document.getElementById("dictionary-path");
          const dictFile = document.getElementById("dictionary-file");
          const hashOutput = document.getElementById("hash-output");
          const hashType = document.getElementById("hash-type");

          // Disable unsupported hash types
          const hashTypeSelect = document.getElementById("hash-type");
          Array.from(hashTypeSelect.options).forEach((option) => {
            if (!["md5", "sha1", "sha256"].includes(option.value)) {
              option.disabled = true;
            }
          });

          // Use a demo dictionary if none is provided
          const demoDictionary = [
            "password",
            "123456",
            "admin",
            "welcome",
            "letmein",
            "monkey",
            "qwerty",
            "dragon",
            "baseball",
            "football",
            "superman",
            "trustno1",
            "sunshine",
            "iloveyou",
            "starwars",
            "whatever",
            "passw0rd",
            "hello123",
            "charlie",
            "robert",
            "thomas",
            "hockey",
            "ranger",
            "daniel",
            "password123",
            "harley",
            "soccer",
            "batman",
            "andrew",
            "tigger",
            "master",
            "jennifer",
            "jordan",
            "hunter",
            "buster",
            "soccer",
            "shadow",
            "michael",
            "michelle",
            "secret",
          ];

          // Browse button opens file dialog
          browseBtn.addEventListener("click", () => {
            dictFile.click();
          });

          // Handle file selection
          dictFile.addEventListener("change", function (e) {
            if (this.files && this.files.length > 0) {
              const file = this.files[0];
              dictPath.value = file.name;

              // Preview dictionary content with compact display
              const reader = new FileReader();
              reader.onload = function (event) {
                const content = event.target.result;
                const wordCount = content
                  .split(/\r?\n/)
                  .filter((word) => word.trim().length > 0).length;
                hashOutput.textContent = `Dictionary: ${
                  file.name
                } (${wordCount.toLocaleString()} words, ${formatFileSize(
                  file.size
                )})
Ready to crack hashes.`;
              };
              reader.readAsText(file);
            }
          });

          // Format file size in human-readable form
          function formatFileSize(bytes) {
            if (bytes === 0) return "0 Bytes";
            const k = 1024;
            const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (
              parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
            );
          }

          // Clear button functionality
          clearBtn.addEventListener("click", () => {
            hashInput.value = "";
            hashOutput.textContent = "";
            dictPath.value = "";
            dictFile.value = "";
          });

          // Load CryptoJS from CDN if not already available
          function loadCryptoJS() {
            return new Promise((resolve, reject) => {
              if (window.CryptoJS) {
                resolve();
                return;
              }

              const script = document.createElement("script");
              script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
              script.integrity =
                "sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==";
              script.crossOrigin = "anonymous";
              script.referrerPolicy = "no-referrer";

              script.onload = resolve;
              script.onerror = () =>
                reject(new Error("Failed to load CryptoJS"));

              document.head.appendChild(script);
            });
          }

          // Generate hash based on algorithm
          async function generateHash(message, algorithm) {
            switch (algorithm) {
              case "md5":
                return CryptoJS.MD5(message).toString();
              case "sha1":
                return CryptoJS.SHA1(message).toString();
              case "sha256":
                return CryptoJS.SHA256(message).toString();
              default:
                throw new Error("Unsupported hash algorithm");
            }
          }

          // Enhanced hash cracking function with optimized display
          crackBtn.addEventListener("click", async () => {
            const hash = hashInput.value.trim().toLowerCase();
            const type = hashType.value;

            // Validate input
            if (!hash) {
              hashOutput.textContent = "ERROR: No hash provided";
              gsap.fromTo(
                hashOutput,
                { backgroundColor: "rgba(50, 0, 0, 0.4)" },
                { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.5 }
              );
              return;
            }

            // Validate hash format based on type
            const hashFormats = {
              md5: /^[a-f0-9]{32}$/i,
              sha1: /^[a-f0-9]{40}$/i,
              sha256: /^[a-f0-9]{64}$/i,
            };

            if (!hashFormats[type].test(hash)) {
              hashOutput.textContent = `ERROR: Invalid ${type.toUpperCase()} hash format`;
              gsap.fromTo(
                hashOutput,
                { backgroundColor: "rgba(50, 0, 0, 0.4)" },
                { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.5 }
              );
              return;
            }

            try {
              // Load CryptoJS library
              await loadCryptoJS();

              // Get dictionary
              let dictionary = [];
              if (dictFile.files && dictFile.files.length > 0) {
                // Read from file
                const reader = new FileReader();
                reader.onload = function (event) {
                  const content = event.target.result;
                  dictionary = content
                    .split(/\r?\n/)
                    .filter((word) => word.trim().length > 0);
                  startCracking(dictionary);
                };
                reader.readAsText(dictFile.files[0]);
              } else {
                // Use demo dictionary if no file selected
                dictionary = demoDictionary;
                if (!dictPath.value) {
                  dictPath.value = "default-wordlist.txt";
                }
                startCracking(dictionary);
              }
            } catch (error) {
              hashOutput.textContent = `ERROR: ${error.message}`;
              gsap.fromTo(
                hashOutput,
                { backgroundColor: "rgba(50, 0, 0, 0.4)" },
                { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.5 }
              );
            }

            async function startCracking(wordlist) {
              // Clear previous content and reset styles
              hashOutput.innerHTML = "";
              hashOutput.style.padding = "8px";
              hashOutput.style.height = "auto";
              hashOutput.style.maxHeight = "180px"; // Increased max-height to use more available space

              // Create a more compact UI with inline status bar
              const statusBar = document.createElement("div");
              statusBar.style.display = "flex";
              statusBar.style.justifyContent = "space-between";
              statusBar.style.alignItems = "center";
              statusBar.style.padding = "4px 0";
              statusBar.style.borderBottom = "1px solid rgba(255, 140, 0, 0.3)";
              statusBar.style.marginBottom = "6px";
              statusBar.style.fontSize = "11px";

              const statusLeft = document.createElement("div");
              statusLeft.innerHTML = `<span style="color: rgba(255, 165, 0, 0.9);">[*] Cracking ${type.toUpperCase()}</span>`;

              const statusRight = document.createElement("div");
              statusRight.innerHTML = `<span style="color: rgba(255, 165, 0, 0.8);">${wordlist.length.toLocaleString()} words</span>`;

              statusBar.appendChild(statusLeft);
              statusBar.appendChild(statusRight);

              // Attempts area - optimized height
              const attemptsArea = document.createElement("div");
              attemptsArea.style.height = "auto";
              attemptsArea.style.maxHeight = "145px"; // Allow more space for attempts
              attemptsArea.style.overflow = "hidden";
              attemptsArea.style.fontFamily = "monospace";
              attemptsArea.style.fontSize = "10px"; // Smaller font
              attemptsArea.style.lineHeight = "1.2"; // Tighter line spacing

              // Add to main output
              hashOutput.appendChild(statusBar);
              hashOutput.appendChild(attemptsArea);

              // Cracking process variables
              const totalWords = wordlist.length;
              let checked = 0;
              let foundWord = null;
              let startTime = Date.now();
              let hashesPerSecond = 0;
              let lastUpdate = Date.now();
              let lastChecked = 0;

              // Speed varies by hash type
              const batchSize =
                type === "sha256" ? 15 : type === "sha1" ? 25 : 40;

              function updateStats() {
                const now = Date.now();
                const elapsedSinceUpdate = (now - lastUpdate) / 1000;

                if (elapsedSinceUpdate >= 0.1) {
                  const recentHashes = checked - lastChecked;
                  hashesPerSecond = Math.round(
                    recentHashes / elapsedSinceUpdate
                  );

                  const progress = Math.min(
                    100,
                    (checked / totalWords) * 100
                  ).toFixed(1);
                  statusRight.innerHTML = `<span style="color: rgba(255, 165, 0, 0.8);">${hashesPerSecond.toLocaleString()}/s (${progress}%)</span>`;

                  lastUpdate = now;
                  lastChecked = checked;
                }
              }

              function addAttempt(word, isMatch = false) {
                const attempt = document.createElement("div");
                attempt.style.marginBottom = "1px"; // Reduced margin
                attempt.style.whiteSpace = "nowrap";
                attempt.style.overflow = "hidden";
                attempt.style.textOverflow = "ellipsis";

                if (isMatch) {
                  attempt.innerHTML = `<span style="color:rgba(100, 255, 100, 0.9);">[MATCH]</span> "${word}"`;
                  attempt.style.backgroundColor = "rgba(0, 40, 0, 0.3)";
                  attempt.style.padding = "2px 4px";
                } else {
                  attempt.innerHTML = `<span style="color:rgba(180, 180, 180, 0.6);">[try]</span> ${word}`;
                }

                attemptsArea.insertBefore(attempt, attemptsArea.firstChild);

                // Keep only last 8 attempts visible (increased from 6)
                while (attemptsArea.children.length > 8) {
                  attemptsArea.removeChild(attemptsArea.lastChild);
                }
              }

              // Main cracking process
              async function processWords() {
                if (foundWord || checked >= totalWords) {
                  return;
                }

                const wordBatch = wordlist.slice(checked, checked + batchSize);

                for (const word of wordBatch) {
                  // Show only some attempts to avoid UI flooding
                  const showAttempt = Math.random() > 0.85;

                  try {
                    const wordHash = await generateHash(word, type);

                    if (wordHash.toLowerCase() === hash.toLowerCase()) {
                      foundWord = word;
                      addAttempt(word, true);
                      break;
                    } else if (showAttempt) {
                      addAttempt(word, false);
                    }
                  } catch (e) {
                    console.error("Hash error:", e);
                  }

                  checked++;
                }

                updateStats();

                if (foundWord) {
                  completeCracking(foundWord);
                } else if (checked >= totalWords) {
                  completeCracking(null);
                } else {
                  setTimeout(processWords, 5);
                }
              }

              // Start cracking
              processWords();

              function completeCracking(result) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

                // Clear attempts area but preserve height
                attemptsArea.innerHTML = "";

                if (result) {
                  // Success - more compact success message
                  const resultBox = document.createElement("div");
                  resultBox.style.padding = "6px";
                  resultBox.style.backgroundColor = "rgba(0, 40, 0, 0.3)";
                  resultBox.style.border = "1px solid rgba(70, 200, 70, 0.4)";
                  resultBox.style.borderRadius = "4px";
                  resultBox.style.display = "flex";
                  resultBox.style.flexDirection = "column";
                  resultBox.style.gap = "4px";

                  // Simple clear result display with flex layout
                  resultBox.innerHTML = `
<div style="color: rgba(100, 255, 100, 0.9); font-weight: bold; display: flex; justify-content: space-between;">
  <span>✓ HASH CRACKED</span>
  <span style="font-size: 9px; color: rgba(180, 180, 180, 0.7); font-weight: normal;">${hashesPerSecond.toLocaleString()}/sec | ${elapsed}s</span>
</div>
<div>Plaintext: <span style="color: rgba(255, 200, 0, 0.9); font-weight: bold; font-size: 14px;">${result}</span></div>`;

                  attemptsArea.appendChild(resultBox);

                  // Update status bar
                  statusLeft.innerHTML = `<span style="color: rgba(100, 255, 100, 0.9);">[+] Hash cracked!</span>`;

                  // Highlight with animation
                  gsap.fromTo(
                    resultBox,
                    { backgroundColor: "rgba(0, 60, 0, 0.4)" },
                    { backgroundColor: "rgba(0, 40, 0, 0.3)", duration: 0.8 }
                  );
                } else {
                  // Failed - more compact error
                  const resultBox = document.createElement("div");
                  resultBox.style.padding = "6px";
                  resultBox.style.backgroundColor = "rgba(40, 0, 0, 0.3)";
                  resultBox.style.border = "1px solid rgba(200, 70, 70, 0.4)";
                  resultBox.style.borderRadius = "4px";
                  resultBox.style.display = "flex";
                  resultBox.style.flexDirection = "column";

                  // Simple error message with stats on same line
                  resultBox.innerHTML = `
            <div style="color: rgba(255, 100, 100, 0.9); font-weight: bold; display: flex; justify-content: space-between;">
              <span>✗ HASH NOT FOUND</span>
              <span style="font-size: 9px; color: rgba(180, 180, 180, 0.7); font-weight: normal;">${hashesPerSecond.toLocaleString()}/sec | ${elapsed}s</span>
            </div>`;

                  attemptsArea.appendChild(resultBox);

                  // Update status bar
                  statusLeft.innerHTML = `<span style="color: rgba(255, 100, 100, 0.9);">[-] Dictionary exhausted</span>`;

                  // Highlight with animation
                  gsap.fromTo(
                    resultBox,
                    { backgroundColor: "rgba(60, 0, 0, 0.4)" },
                    { backgroundColor: "rgba(40, 0, 0, 0.3)", duration: 0.8 }
                  );
                }
              }
            }
          });
        }

        // Initialize the text encryption interface on load
        initTextEncryptListeners();

        // Terminal close button functionality
        document
          .querySelector(".terminal-btn.close")
          .addEventListener("click", () => {
            gsap.to(terminal, {
              opacity: 0,
              y: 20,
              scale: 0.95,
              duration: 0.5,
              onComplete: () => {
                terminal.style.display = "none";
              },
            });
          });

        // Add event listeners to navbar buttons and brand name to show the terminal
        document
          .querySelector(".navbar-brand")
          .addEventListener("click", () => {
            showTerminal();
          });

        document.querySelectorAll(".tool-button").forEach((button) => {
          button.addEventListener("click", () => {
            // First show the terminal if it's hidden
            if (terminal.style.display === "none") {
              showTerminal();
              // Wait a bit for the animation to complete before changing content
              setTimeout(() => {
                // The existing click event will handle the content change
              }, 300);
            }
          });
        });

        // Function to show the terminal window
        function showTerminal() {
          const terminal = document.querySelector(".terminal-container");
          terminal.style.display = "flex";
          gsap.fromTo(
            terminal,
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
          );
        }
      });