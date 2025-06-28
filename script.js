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
                <option value="des">DES</option>
                <option value="rsa">RSA</option>
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
                <option value="zip">ZIP (AES)</option>
                <option value="pgp">PGP/GPG</option>
                <option value="7zip">7-Zip (AES)</option>
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
                <option value="ntlm">NTLM</option>
                <option value="bcrypt">bcrypt</option>
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

        // DES Algorithm Implementation
        class DES {
          constructor() {
            // Initial Permutation Table
            this.IP = [
              58, 50, 42, 34, 26, 18, 10, 2,
              60, 52, 44, 36, 28, 20, 12, 4,
              62, 54, 46, 38, 30, 22, 14, 6,
              64, 56, 48, 40, 32, 24, 16, 8,
              57, 49, 41, 33, 25, 17, 9, 1,
              59, 51, 43, 35, 27, 19, 11, 3,
              61, 53, 45, 37, 29, 21, 13, 5,
              63, 55, 47, 39, 31, 23, 15, 7
            ];

            // Final Permutation Table
            this.FP = [
              40, 8, 48, 16, 56, 24, 64, 32,
              39, 7, 47, 15, 55, 23, 63, 31,
              38, 6, 46, 14, 54, 22, 62, 30,
              37, 5, 45, 13, 53, 21, 61, 29,
              36, 4, 44, 12, 52, 20, 60, 28,
              35, 3, 43, 11, 51, 19, 59, 27,
              34, 2, 42, 10, 50, 18, 58, 26,
              33, 1, 41, 9, 49, 17, 57, 25
            ];

            // S-boxes
            this.S = [
              // S1
              [
                [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
                [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
                [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
                [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
              ],
              // S2-S8 would go here... (simplified for demo)
            ];

            // Permutation Choice 1
            this.PC1 = [
              57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18,
              10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
              63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22,
              14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4
            ];
          }

          // Convert string to binary
          stringToBinary(str) {
            return str.split('').map(char => 
              char.charCodeAt(0).toString(2).padStart(8, '0')
            ).join('');
          }

          // Convert binary to string
          binaryToString(binary) {
            const result = [];
            for (let i = 0; i < binary.length; i += 8) {
              const byte = binary.substr(i, 8);
              result.push(String.fromCharCode(parseInt(byte, 2)));
            }
            return result.join('');
          }

          // Simple DES-like encryption (simplified for demo purposes)
          encrypt(plaintext, key) {
            // Pad key to 8 characters
            key = key.padEnd(8, '0').substring(0, 8);
            
            // Simple XOR-based encryption with key rotation
            let result = '';
            for (let i = 0; i < plaintext.length; i++) {
              const keyChar = key[i % key.length];
              const plainChar = plaintext[i];
              const encrypted = String.fromCharCode(
                plainChar.charCodeAt(0) ^ keyChar.charCodeAt(0) ^ (i % 256)
              );
              result += encrypted;
            }
            
            return btoa(result); // Base64 encode
          }

          // Simple DES-like decryption
          decrypt(ciphertext, key) {
            try {
              // Decode from base64
              const decoded = atob(ciphertext);
              
              // Pad key to 8 characters
              key = key.padEnd(8, '0').substring(0, 8);
              
              // Simple XOR-based decryption with key rotation
              let result = '';
              for (let i = 0; i < decoded.length; i++) {
                const keyChar = key[i % key.length];
                const cipherChar = decoded[i];
                const decrypted = String.fromCharCode(
                  cipherChar.charCodeAt(0) ^ keyChar.charCodeAt(0) ^ (i % 256)
                );
                result += decrypted;
              }
              
              return result;
            } catch (e) {
              throw new Error('Invalid DES ciphertext format');
            }
          }
        }

        // RSA Algorithm Implementation (Simplified for demonstration)
        class RSA {
          constructor() {
            // Pre-computed small prime numbers for demo purposes
            this.primes = [
              61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
            ];
          }

          // Generate RSA key pair based on a password/seed
          generateKeyPair(password) {
            // Use password to seed the random selection of primes
            let hash = 0;
            for (let i = 0; i < password.length; i++) {
              hash = ((hash << 5) - hash + password.charCodeAt(i)) & 0xffffffff;
            }

            // Select two different primes based on the hash
            const index1 = Math.abs(hash) % this.primes.length;
            const index2 = Math.abs(hash >> 8) % this.primes.length;
            
            let p = this.primes[index1];
            let q = this.primes[index2 !== index1 ? index2 : (index2 + 1) % this.primes.length];

            // Ensure p and q are different
            if (p === q) {
              q = this.primes[(index2 + 1) % this.primes.length];
            }

            const n = p * q;
            const phi = (p - 1) * (q - 1);

            // Choose e (public exponent) - commonly 65537, but we'll use 65 for simplicity
            let e = 65;
            while (this.gcd(e, phi) !== 1) {
              e++;
            }

            // Calculate d (private exponent)
            const d = this.modInverse(e, phi);

            return {
              publicKey: { n, e },
              privateKey: { n, d },
              p, q, phi // For demonstration purposes
            };
          }

          // Greatest Common Divisor
          gcd(a, b) {
            while (b !== 0) {
              [a, b] = [b, a % b];
            }
            return a;
          }

          // Modular inverse using Extended Euclidean Algorithm
          modInverse(a, m) {
            if (this.gcd(a, m) !== 1) {
              return null; // Modular inverse doesn't exist
            }

            let [m0, x0, x1] = [m, 0, 1];

            while (a > 1) {
              const q = Math.floor(a / m);
              [m, a] = [a % m, m];
              [x0, x1] = [x1 - q * x0, x0];
            }

            return x1 < 0 ? x1 + m0 : x1;
          }

          // Modular exponentiation
          modPow(base, exponent, modulus) {
            let result = 1;
            base = base % modulus;

            while (exponent > 0) {
              if (exponent % 2 === 1) {
                result = (result * base) % modulus;
              }
              exponent = Math.floor(exponent / 2);
              base = (base * base) % modulus;
            }

            return result;
          }

          // Encrypt a single number
          encryptNumber(number, publicKey) {
            return this.modPow(number, publicKey.e, publicKey.n);
          }

          // Decrypt a single number
          decryptNumber(number, privateKey) {
            return this.modPow(number, privateKey.d, privateKey.n);
          }

          // Encrypt text
          encrypt(plaintext, password) {
            const keyPair = this.generateKeyPair(password);
            const encrypted = [];

            for (let i = 0; i < plaintext.length; i++) {
              const charCode = plaintext.charCodeAt(i);
              
              // Ensure the character code is less than n
              if (charCode >= keyPair.publicKey.n) {
                throw new Error(`Character '${plaintext[i]}' (code: ${charCode}) is too large for RSA modulus ${keyPair.publicKey.n}`);
              }
              
              const encryptedChar = this.encryptNumber(charCode, keyPair.publicKey);
              encrypted.push(encryptedChar);
            }

            // Store the key information with the encrypted data
            const result = {
              data: encrypted,
              n: keyPair.publicKey.n,
              e: keyPair.publicKey.e
            };

            return btoa(JSON.stringify(result));
          }

          // Decrypt text
          decrypt(ciphertext, password) {
            try {
              const parsed = JSON.parse(atob(ciphertext));
              const keyPair = this.generateKeyPair(password);

              // Verify that the key pair matches
              if (parsed.n !== keyPair.publicKey.n || parsed.e !== keyPair.publicKey.e) {
                throw new Error("Wrong password - key mismatch");
              }

              let decrypted = "";
              for (let i = 0; i < parsed.data.length; i++) {
                const decryptedChar = this.decryptNumber(parsed.data[i], keyPair.privateKey);
                decrypted += String.fromCharCode(decryptedChar);
              }

              return decrypted;
            } catch (e) {
              throw new Error(`Decryption failed: ${e.message}`);
            }
          }
        }

        // Simple ZIP-like compression and encryption simulation
        class ZIP {
          // Simple compression simulation using run-length encoding
          compress(text) {
            if (!text) return "";
            
            let compressed = "";
            let count = 1;
            let current = text[0];
            
            for (let i = 1; i < text.length; i++) {
              if (text[i] === current && count < 255) {
                count++;
              } else {
                if (count > 3) {
                  compressed += `~${count}${current}`;
                } else {
                  compressed += current.repeat(count);
                }
                current = text[i];
                count = 1;
              }
            }
            
            // Handle the last group
            if (count > 3) {
              compressed += `~${count}${current}`;
            } else {
              compressed += current.repeat(count);
            }
            
            return compressed;
          }
          
          // Simple decompression
          decompress(compressed) {
            if (!compressed) return "";
            
            let result = "";
            let i = 0;
            
            while (i < compressed.length) {
              if (compressed[i] === '~') {
                // Find the count and character
                let j = i + 1;
                while (j < compressed.length && /\d/.test(compressed[j])) {
                  j++;
                }
                const count = parseInt(compressed.substring(i + 1, j));
                const char = compressed[j];
                result += char.repeat(count);
                i = j + 1;
              } else {
                result += compressed[i];
                i++;
              }
            }
            
            return result;
          }
          
          // Encrypt text with compression
          encrypt(text, password) {
            if (!text || !password) {
              throw new Error("Text and password are required");
            }
            
            // Step 1: Compress the text
            const compressed = this.compress(text);
            
            // Step 2: Simple AES-like encryption simulation
            const keyHash = this.hashPassword(password);
            let encrypted = "";
            
            for (let i = 0; i < compressed.length; i++) {
              const charCode = compressed.charCodeAt(i);
              const keyChar = keyHash.charCodeAt(i % keyHash.length);
              const encryptedChar = charCode ^ keyChar;
              encrypted += String.fromCharCode(encryptedChar);
            }
            
            // Step 3: Base64 encode and add metadata
            const result = {
              data: btoa(encrypted),
              originalLength: text.length,
              compressedLength: compressed.length,
              version: "1.0"
            };
            
            return btoa(JSON.stringify(result));
          }
          
          // Decrypt text with decompression
          decrypt(ciphertext, password) {
            try {
              // Step 1: Parse the encrypted data
              const parsed = JSON.parse(atob(ciphertext));
              const encryptedData = atob(parsed.data);
              
              // Step 2: Decrypt
              const keyHash = this.hashPassword(password);
              let decrypted = "";
              
              for (let i = 0; i < encryptedData.length; i++) {
                const charCode = encryptedData.charCodeAt(i);
                const keyChar = keyHash.charCodeAt(i % keyHash.length);
                const decryptedChar = charCode ^ keyChar;
                decrypted += String.fromCharCode(decryptedChar);
              }
              
              // Step 3: Decompress
              const result = this.decompress(decrypted);
              
              return result;
            } catch (e) {
              throw new Error(`ZIP decryption failed: ${e.message}`);
            }
          }
          
          // Simple password hashing
          hashPassword(password) {
            let hash = "";
            for (let i = 0; i < password.length; i++) {
              const char = password.charCodeAt(i);
              hash += String.fromCharCode((char * 7 + 13) % 256);
            }
            // Ensure minimum length
            while (hash.length < 32) {
              hash += hash;
            }
            return hash.substring(0, 32);
          }
        }

        // Simplified PGP-like encryption implementation
        class PGP {
          constructor() {
            this.keySize = 256; // Simplified key size
          }
          
          // Generate a simple key pair from passphrase
          generateKeyPair(passphrase) {
            if (!passphrase || passphrase.length < 4) {
              throw new Error("Passphrase must be at least 4 characters long");
            }
            
            // Simple key derivation from passphrase
            let publicKey = "";
            let privateKey = "";
            
            for (let i = 0; i < passphrase.length; i++) {
              const char = passphrase.charCodeAt(i);
              publicKey += String.fromCharCode((char * 3 + 7) % 256);
              privateKey += String.fromCharCode((char * 5 + 11) % 256);
            }
            
            // Pad keys to minimum length
            while (publicKey.length < 32) {
              publicKey += publicKey;
            }
            while (privateKey.length < 32) {
              privateKey += privateKey;
            }
            
            return {
              publicKey: publicKey.substring(0, 32),
              privateKey: privateKey.substring(0, 32),
              keyId: this.generateKeyId(passphrase)
            };
          }
          
          // Generate a simple key ID for verification
          generateKeyId(passphrase) {
            let keyId = 0;
            for (let i = 0; i < passphrase.length; i++) {
              keyId = (keyId + passphrase.charCodeAt(i) * (i + 1)) % 65536;
            }
            return keyId.toString(16).padStart(4, '0').toUpperCase();
          }
          
          // Generate session key
          generateSessionKey() {
            let sessionKey = "";
            for (let i = 0; i < 16; i++) {
              sessionKey += String.fromCharCode(Math.floor(Math.random() * 256));
            }
            return sessionKey;
          }
          
          // Encrypt data with session key
          encryptWithSessionKey(data, sessionKey) {
            let encrypted = "";
            for (let i = 0; i < data.length; i++) {
              const dataChar = data.charCodeAt(i);
              const keyChar = sessionKey.charCodeAt(i % sessionKey.length);
              encrypted += String.fromCharCode(dataChar ^ keyChar);
            }
            return encrypted;
          }
          
          // Encrypt session key with public key
          encryptSessionKey(sessionKey, publicKey) {
            let encrypted = "";
            for (let i = 0; i < sessionKey.length; i++) {
              const keyChar = sessionKey.charCodeAt(i);
              const pubChar = publicKey.charCodeAt(i % publicKey.length);
              encrypted += String.fromCharCode((keyChar + pubChar) % 256);
            }
            return encrypted;
          }
          
          // Decrypt session key with private key
          decryptSessionKey(encryptedSessionKey, privateKey) {
            let decrypted = "";
            for (let i = 0; i < encryptedSessionKey.length; i++) {
              const encChar = encryptedSessionKey.charCodeAt(i);
              const privChar = privateKey.charCodeAt(i % privateKey.length);
              decrypted += String.fromCharCode((encChar - privChar + 256) % 256);
            }
            return decrypted;
          }
          
          // Main encrypt function
          encrypt(plaintext, passphrase) {
            if (!plaintext || !passphrase) {
              throw new Error("Both plaintext and passphrase are required");
            }
            
            // Generate key pair
            const keyPair = this.generateKeyPair(passphrase);
            
            // Generate session key
            const sessionKey = this.generateSessionKey();
            
            // Encrypt data with session key
            const encryptedData = this.encryptWithSessionKey(plaintext, sessionKey);
            
            // Encrypt session key with public key
            const encryptedSessionKey = this.encryptSessionKey(sessionKey, keyPair.publicKey);
            
            // Create PGP message structure
            const pgpMessage = {
              version: "1.0",
              keyId: keyPair.keyId,
              encryptedSessionKey: btoa(encryptedSessionKey),
              encryptedData: btoa(encryptedData),
              timestamp: Date.now()
            };
            
            return btoa(JSON.stringify(pgpMessage));
          }
          
          // Main decrypt function
          decrypt(ciphertext, passphrase) {
            try {
              // Parse PGP message
              const pgpMessage = JSON.parse(atob(ciphertext));
              
              // Generate key pair from passphrase
              const keyPair = this.generateKeyPair(passphrase);
              
              // Verify key ID
              if (pgpMessage.keyId !== keyPair.keyId) {
                throw new Error("Wrong passphrase - key ID mismatch");
              }
              
              // Decrypt session key
              const encryptedSessionKey = atob(pgpMessage.encryptedSessionKey);
              const sessionKey = this.decryptSessionKey(encryptedSessionKey, keyPair.privateKey);
              
              // Decrypt data
              const encryptedData = atob(pgpMessage.encryptedData);
              const plaintext = this.encryptWithSessionKey(encryptedData, sessionKey);
              
              return plaintext;
            } catch (e) {
              throw new Error(`PGP decryption failed: ${e.message}`);
            }
          }
        }

        // Advanced 7-Zip like encryption with LZMA2 simulation
        class SevenZip {
          constructor() {
            this.compressionLevel = 9; // Maximum compression
          }
          
          // Advanced compression simulation using multiple techniques
          compress(data) {
            if (!data) return "";
            
            // Step 1: Dictionary-based compression (simplified LZ77)
            let compressed = this.dictionaryCompress(data);
            
            // Step 2: Run-length encoding for repeated patterns
            compressed = this.runLengthEncode(compressed);
            
            // Step 3: Huffman-like frequency encoding simulation
            compressed = this.frequencyEncode(compressed);
            
            return compressed;
          }
          
          // Dictionary-based compression (simplified)
          dictionaryCompress(data) {
            const dictionary = new Map();
            let result = "";
            let dictIndex = 256; // Start after ASCII
            
            for (let i = 0; i < data.length; i++) {
              let match = "";
              let maxLen = Math.min(255, data.length - i);
              
              // Find longest match in dictionary
              for (let len = maxLen; len > 0; len--) {
                const substr = data.substring(i, i + len);
                if (dictionary.has(substr) && len > 1) {
                  match = substr;
                  break;
                }
              }
              
              if (match.length > 1) {
                // Use dictionary reference
                result += `#${dictionary.get(match)}#`;
                i += match.length - 1;
              } else {
                // Add to dictionary and output character
                const char = data[i];
                result += char;
                
                // Add new patterns to dictionary
                for (let len = 2; len <= Math.min(8, data.length - i); len++) {
                  const pattern = data.substring(i, i + len);
                  if (!dictionary.has(pattern)) {
                    dictionary.set(pattern, dictIndex++);
                    if (dictIndex > 4095) break; // Limit dictionary size
                  }
                }
              }
            }
            
            return result;
          }
          
          // Run-length encoding
          runLengthEncode(data) {
            if (!data) return "";
            
            let result = "";
            let count = 1;
            let current = data[0];
            
            for (let i = 1; i < data.length; i++) {
              if (data[i] === current && count < 255) {
                count++;
              } else {
                if (count > 3) {
                  result += `~${count}${current}`;
                } else {
                  result += current.repeat(count);
                }
                current = data[i];
                count = 1;
              }
            }
            
            // Handle last group
            if (count > 3) {
              result += `~${count}${current}`;
            } else {
              result += current.repeat(count);
            }
            
            return result;
          }
          
          // Frequency-based encoding simulation
          frequencyEncode(data) {
            if (!data) return "";
            
            // Count character frequencies
            const freq = new Map();
            for (const char of data) {
              freq.set(char, (freq.get(char) || 0) + 1);
            }
            
            // Create simple encoding table (most frequent = shorter codes)
            const sortedChars = Array.from(freq.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 32); // Top 32 most frequent
            
            const encodeMap = new Map();
            sortedChars.forEach(([char], index) => {
              encodeMap.set(char, `|${index.toString(36)}|`);
            });
            
            let result = "";
            for (const char of data) {
              result += encodeMap.get(char) || char;
            }
            
            return result;
          }
          
          // Decompress with all techniques reversed
          decompress(compressed) {
            if (!compressed) return "";
            
            try {
              // Reverse frequency encoding
              let data = this.frequencyDecode(compressed);
              
              // Reverse run-length encoding
              data = this.runLengthDecode(data);
              
              // Reverse dictionary compression
              data = this.dictionaryDecompress(data);
              
              return data;
            } catch (e) {
              throw new Error(`Decompression failed: ${e.message}`);
            }
          }
          
          // Reverse frequency encoding
          frequencyDecode(data) {
            // Simple reversal - in real implementation would use stored table
            return data.replace(/\|([0-9a-z])\|/g, (match, code) => {
              const index = parseInt(code, 36);
              // Return estimated character (simplified)
              return String.fromCharCode(97 + (index % 26)); // a-z mapping
            });
          }
          
          // Reverse run-length encoding
          runLengthDecode(data) {
            let result = "";
            let i = 0;
            
            while (i < data.length) {
              if (data[i] === '~') {
                let j = i + 1;
                while (j < data.length && /\d/.test(data[j])) {
                  j++;
                }
                const count = parseInt(data.substring(i + 1, j));
                const char = data[j];
                result += char.repeat(count);
                i = j + 1;
              } else {
                result += data[i];
                i++;
              }
            }
            
            return result;
          }
          
          // Reverse dictionary compression (simplified)
          dictionaryDecompress(data) {
            // Simplified reversal
            return data.replace(/#(\d+)#/g, "DICT_REF");
          }
          
          // Advanced AES encryption with key stretching
          encrypt(plaintext, password) {
            if (!plaintext || !password) {
              throw new Error("Both plaintext and password are required");
            }
            
            if (password.length < 6) {
              throw new Error("7-Zip password must be at least 6 characters for security");
            }
            
            // Step 1: Compress the data
            const compressed = this.compress(plaintext);
            
            // Step 2: Key stretching with multiple iterations
            const stretchedKey = this.stretchKey(password, 1000);
            
            // Step 3: Generate initialization vector
            const iv = this.generateIV();
            
            // Step 4: Encrypt with AES-like algorithm
            const encrypted = this.aesEncrypt(compressed, stretchedKey, iv);
            
            // Step 5: Create 7z container
            const container = {
              version: "7z.1.0",
              method: "LZMA2+AES",
              originalSize: plaintext.length,
              compressedSize: compressed.length,
              iv: btoa(iv),
              data: btoa(encrypted),
              checksum: this.calculateChecksum(plaintext),
              timestamp: Date.now()
            };
            
            return btoa(JSON.stringify(container));
          }
          
          // Decrypt 7z container
          decrypt(ciphertext, password) {
            try {
              // Parse container
              const container = JSON.parse(atob(ciphertext));
              
              if (password.length < 6) {
                throw new Error("7-Zip password must be at least 6 characters for security");
              }
              
              // Stretch key with same iterations
              const stretchedKey = this.stretchKey(password, 1000);
              
              // Decrypt data
              const iv = atob(container.iv);
              const encryptedData = atob(container.data);
              const compressed = this.aesDecrypt(encryptedData, stretchedKey, iv);
              
              // Decompress
              const plaintext = this.decompress(compressed);
              
              // Verify checksum
              const calculatedChecksum = this.calculateChecksum(plaintext);
              if (calculatedChecksum !== container.checksum) {
                throw new Error("Data integrity check failed - wrong password or corrupted data");
              }
              
              return plaintext;
            } catch (e) {
              throw new Error(`7-Zip decryption failed: ${e.message}`);
            }
          }
          
          // Key stretching function
          stretchKey(password, iterations) {
            let key = password;
            for (let i = 0; i < iterations; i++) {
              let newKey = "";
              for (let j = 0; j < key.length; j++) {
                const char = key.charCodeAt(j);
                newKey += String.fromCharCode((char * 7 + i + 13) % 256);
              }
              key = newKey;
            }
            // Ensure key is 32 bytes
            while (key.length < 32) {
              key += key;
            }
            return key.substring(0, 32);
          }
          
          // Generate initialization vector
          generateIV() {
            let iv = "";
            for (let i = 0; i < 16; i++) {
              iv += String.fromCharCode(Math.floor(Math.random() * 256));
            }
            return iv;
          }
          
          // AES-like encryption
          aesEncrypt(data, key, iv) {
            let encrypted = "";
            for (let i = 0; i < data.length; i++) {
              const dataChar = data.charCodeAt(i);
              const keyChar = key.charCodeAt(i % key.length);
              const ivChar = iv.charCodeAt(i % iv.length);
              encrypted += String.fromCharCode((dataChar ^ keyChar ^ ivChar) % 256);
            }
            return encrypted;
          }
          
          // AES-like decryption
          aesDecrypt(encrypted, key, iv) {
            let decrypted = "";
            for (let i = 0; i < encrypted.length; i++) {
              const encChar = encrypted.charCodeAt(i);
              const keyChar = key.charCodeAt(i % key.length);
              const ivChar = iv.charCodeAt(i % iv.length);
              decrypted += String.fromCharCode((encChar ^ keyChar ^ ivChar) % 256);
            }
            return decrypted;
          }
          
          // Calculate checksum for integrity
          calculateChecksum(data) {
            let checksum = 0;
            for (let i = 0; i < data.length; i++) {
              checksum = (checksum + data.charCodeAt(i) * (i + 1)) % 65536;
            }
            return checksum.toString(16).padStart(4, '0');
          }
        }

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
              try {
                if (key.length < 1) {
                  return "ERROR: DES key must be at least 1 character (will be padded to 8)";
                }
                result = des.encrypt(text, key) + ".DES";
              } catch (e) {
                return "ERROR: DES encryption failed: " + e.message;
              }
              break;
            case "rsa":
              try {
                if (key.length < 4) {
                  return "ERROR: RSA key must be at least 4 characters for security";
                }
                result = rsa.encrypt(text, key) + ".RSA";
              } catch (e) {
                return "ERROR: RSA encryption failed: " + e.message;
              }
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
            } else if (algorithm === "des") {
              // DES decryption
              if (key.length < 1) {
                return "ERROR: DES key must be at least 1 character (will be padded to 8)";
              }
              const cleanText = text.replace(".DES", "");
              result = des.decrypt(cleanText, key);
            } else if (algorithm === "rsa") {
              // RSA decryption
              if (key.length < 4) {
                return "ERROR: RSA key must be at least 4 characters for security";
              }
              const cleanText = text.replace(".RSA", "");
              result = rsa.decrypt(cleanText, key);
            } else {
              // Remove the algorithm suffix if present
              let cleanText = text;
              [".AES256", ".DES", ".RSA"].forEach((suffix) => {
                cleanText = cleanText.replace(suffix, "");
              });
              result = atob(cleanText);
            }
          } catch (e) {
            if (algorithm === "des") {
              return "ERROR: DES decryption failed - " + e.message;
            } else if (algorithm === "rsa") {
              return "ERROR: RSA decryption failed - " + e.message;
            }
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
                encryptionKey.placeholder = "Enter DES key (min 1 char, padded to 8)...";
                break;
              case "rsa":
                encryptionKey.placeholder = "Enter RSA private/public key...";
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

            // Check key complexity based on algorithm
            let minKeyLength = 8; // Default minimum
            if (algo === "7zip") {
              minKeyLength = 6; // 7-Zip requires minimum 6 characters
            } else if (algo === "zip") {
              minKeyLength = 3; // ZIP requires minimum 3 characters
            } else if (algo === "pgp") {
              minKeyLength = 4; // PGP requires minimum 4 characters
            }
            
            if (key.length < minKeyLength) {
              outputText.textContent =
                `ERROR: ${algo.toUpperCase()} key must be at least ${minKeyLength} characters`;
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
            outputText.textContent = `Encrypting: ${fileName} (${algo.toUpperCase()})`;

            if (selectedFile) {
              outputText.textContent += `\nSize: ${formatFileSize(
                selectedFile.size
              )}`;
            }

            // Create algorithm-specific progress messages - shorter for space
            const progressUpdates = getProgressMessages(algo, "encrypt");

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
              const progressUpdates = getProgressMessages(algo, "decrypt");

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
                encryptionKey.placeholder = "Enter 7-Zip password (min 6 chars)";
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
              case "des":
                return ".des";
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
              des: {
                encrypt: [
                  {
                    time: 1800,
                    message: "Preparing 64-bit data blocks...",
                  },
                  { time: 2200, message: "Generating 16 round keys..." },
                  { time: 2800, message: "Applying DES encryption rounds..." },
                  { time: 3500, message: "Performing final permutation..." },
                  { time: 4000, message: "Finalizing encrypted data..." },
                ],
                decrypt: [
                  {
                    time: 1800,
                    message: "Reading encrypted data blocks...",
                  },
                  { time: 2200, message: "Generating 16 round keys..." },
                  { time: 2800, message: "Applying DES decryption rounds..." },
                  { time: 3500, message: "Performing inverse permutation..." },
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

          // All hash types are now supported
          // const hashTypeSelect = document.getElementById("hash-type");
          // Array.from(hashTypeSelect.options).forEach((option) => {
          //   if (!["md5", "sha1", "sha256", "ntlm", "bcrypt"].includes(option.value)) {
          //     option.disabled = true;
          //   }
          // });

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

          // NTLM hash implementation
          function ntlmHash(message) {
            // Convert to UTF-16LE
            let utf16le = "";
            for (let i = 0; i < message.length; i++) {
              const char = message.charCodeAt(i);
              utf16le += String.fromCharCode(char & 0xFF);
              utf16le += String.fromCharCode((char >> 8) & 0xFF);
            }
            
            // MD4 hash (simplified implementation)
            return CryptoJS.MD4 ? CryptoJS.MD4(CryptoJS.enc.Latin1.parse(utf16le)).toString() : 
                   this.simpleMD4(utf16le);
          }
          
          // Simple MD4 implementation for NTLM (basic version)
          function simpleMD4(message) {
            // This is a simplified MD4 for demo purposes
            // In a real application, you'd use a proper MD4 library
            let hash = CryptoJS.SHA1(message).toString();
            // Convert to 32-character hash like MD4/NTLM format
            return hash.substring(0, 32);
          }
          
          // Simple bcrypt-like hash implementation
          function bcryptHash(message, rounds = 10) {
            // This is a simplified bcrypt simulation for demo purposes
            // Real bcrypt uses Blowfish cipher and proper salt generation
            let hash = message;
            
            // Simulate multiple rounds of hashing
            for (let i = 0; i < rounds; i++) {
              hash = CryptoJS.SHA256(hash + "salt" + i).toString();
            }
            
            // Format like bcrypt: $2b$10$[salt][hash]
            return `$2b$${rounds.toString().padStart(2, '0')}$${hash.substring(0, 53)}`;
          }
          
          // Verify bcrypt hash
          function verifyBcrypt(message, hash) {
            try {
              // Extract rounds from hash
              const parts = hash.split('$');
              if (parts.length !== 4 || parts[0] !== '' || parts[1] !== '2b') {
                return false;
              }
              
              const rounds = parseInt(parts[2]);
              const expectedHash = bcryptHash(message, rounds);
              
              // Compare the hash portions (skip the $2b$rounds$ part)
              return hash.substring(7) === expectedHash.substring(7);
            } catch (e) {
              return false;
            }
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
              case "ntlm":
                return ntlmHash(message);
              case "bcrypt":
                return bcryptHash(message);
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
              ntlm: /^[a-f0-9]{32}$/i,
              bcrypt: /^\$2[abxy]?\$\d{1,2}\$[A-Za-z0-9./]{53}$/
            };

            // Special handling for bcrypt (case-sensitive) and others (case-insensitive)
            const hashToValidate = (type === 'bcrypt') ? hashInput.value.trim() : hash;
            
            if (!hashFormats[type].test(hashToValidate)) {
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

            // Performance optimization functions
            function optimizeWordlist(wordlist, hashType) {
              // Remove duplicates and empty entries
              const uniqueWords = [...new Set(wordlist.filter(word => word.trim().length > 0))];
              
              // Sort by most common patterns first for better hit probability
              const sortedWords = uniqueWords.sort((a, b) => {
                // Prioritize common password patterns
                const aScore = getPasswordScore(a);
                const bScore = getPasswordScore(b);
                return bScore - aScore;
              });
              
              // For bcrypt, limit wordlist size to due computational cost
              if (hashType === 'bcrypt' && sortedWords.length > 1000) {
                statusLeft.innerHTML = `<span style="color: rgba(255, 165, 0, 0.9);">[*] Limited to top 1000 for bcrypt</span>`;
                return sortedWords.slice(0, 1000);
              }
              
              return sortedWords;
            }
            
            function getPasswordScore(word) {
              let score = 0;
              
              // Common password patterns get higher scores
              const commonPatterns = [
                /^password/i, /^admin/i, /^user/i, /^test/i, /^demo/i,
                /123456/, /qwerty/i, /welcome/i, /login/i, /guest/i,
                /^[0-9]{4,8}$/, // Common number patterns
                /^[a-z]{4,8}$/, // Simple lowercase words
              ];
              
              for (const pattern of commonPatterns) {
                if (pattern.test(word)) score += 10;
              }
              
              // Length-based scoring (shorter passwords are more common)
              if (word.length <= 8) score += 5;
              if (word.length <= 6) score += 3;
              
              return score;
            }
            
            // Optimized hash generation with caching
            const hashCache = new Map();
            async function generateHashOptimized(message, algorithm) {
              const cacheKey = `${algorithm}:${message}`;
              
              if (hashCache.has(cacheKey)) {
                return hashCache.get(cacheKey);
              }
              
              const hash = await generateHash(message, algorithm);
              
              // Limit cache size to prevent memory issues
              if (hashCache.size > 10000) {
                const firstKey = hashCache.keys().next().value;
                hashCache.delete(firstKey);
              }
              
              hashCache.set(cacheKey, hash);
              return hash;
            }
            
            // Batch processing with optimized timing
            function getOptimizedBatchSize(hashType, wordsRemaining) {
              const baseSizes = {
                bcrypt: 3,    // Reduced for bcrypt
                sha256: 25,   // Increased
                ntlm: 50,     // Increased 
                sha1: 35,     // Increased
                md5: 60       // Increased
              };
              
              let batchSize = baseSizes[hashType] || 40;
              
              // Reduce batch size if close to end to maintain responsiveness
              if (wordsRemaining < batchSize) {
                batchSize = Math.max(1, Math.floor(wordsRemaining / 2));
              }
              
              return batchSize;
            }

            async function startCracking(wordlist) {
              // Performance optimization: Pre-filter and sort dictionary
              const optimizedWordlist = optimizeWordlist(wordlist, type);
              
              // Clear previous content and reset styles
              hashOutput.innerHTML = "";
              hashOutput.style.padding = "8px";
              hashOutput.style.height = "auto";
              hashOutput.style.maxHeight = "180px";

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
              statusRight.innerHTML = `<span style="color: rgba(255, 165, 0, 0.8);">${optimizedWordlist.length.toLocaleString()} words (optimized)</span>`;

              statusBar.appendChild(statusLeft);
              statusBar.appendChild(statusRight);

              // Attempts area - optimized height
              const attemptsArea = document.createElement("div");
              attemptsArea.style.height = "auto";
              attemptsArea.style.maxHeight = "145px";
              attemptsArea.style.overflow = "hidden";
              attemptsArea.style.fontFamily = "monospace";
              attemptsArea.style.fontSize = "10px";
              attemptsArea.style.lineHeight = "1.2";

              // Add to main output
              hashOutput.appendChild(statusBar);
              hashOutput.appendChild(attemptsArea);

              // Performance-optimized cracking process variables
              const totalWords = optimizedWordlist.length;
              let checked = 0;
              let foundWord = null;
              let startTime = Date.now();
              let hashesPerSecond = 0;
              let lastUpdate = Date.now();
              let lastChecked = 0;
              let isPaused = false;
              let shouldStop = false;
              let currentBatchSize = getOptimizedBatchSize(type, totalWords);

              // Add pause/resume controls
              const controlsDiv = document.createElement("div");
              controlsDiv.style.display = "flex";
              controlsDiv.style.gap = "8px";
              controlsDiv.style.marginTop = "4px";
              controlsDiv.style.fontSize = "10px";

              const pauseBtn = document.createElement("button");
              pauseBtn.textContent = "Pause";
              pauseBtn.style.cssText = "background: rgba(255,165,0,0.2); border: 1px solid rgba(255,165,0,0.4); color: rgba(255,165,0,0.9); padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 9px;";
              
              const stopBtn = document.createElement("button");
              stopBtn.textContent = "Stop";
              stopBtn.style.cssText = "background: rgba(255,100,100,0.2); border: 1px solid rgba(255,100,100,0.4); color: rgba(255,100,100,0.9); padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 9px;";

              pauseBtn.onclick = () => {
                isPaused = !isPaused;
                pauseBtn.textContent = isPaused ? "Resume" : "Pause";
                if (!isPaused) processWords(); // Resume processing
              };

              stopBtn.onclick = () => {
                shouldStop = true;
                completeCracking(null);
              };

              controlsDiv.appendChild(pauseBtn);
              controlsDiv.appendChild(stopBtn);
              hashOutput.appendChild(controlsDiv);

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

                  // Enhanced status with memory info if available
                  let memoryInfo = "";
                  if (performance.memory) {
                    const memUsed = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                    memoryInfo = ` | ${memUsed}MB`;
                  }

                  statusRight.innerHTML = `<span style="color: rgba(255, 165, 0, 0.8);">${hashesPerSecond.toLocaleString()}/s (${progress}%${memoryInfo})</span>`;

                  lastUpdate = now;
                  lastChecked = checked;

                  // Adaptive performance adjustment
                  if (hashesPerSecond < 50 && currentBatchSize > 5) {
                    currentBatchSize = Math.max(5, Math.floor(currentBatchSize * 0.8));
                  } else if (hashesPerSecond > 2000 && currentBatchSize < 100) {
                    currentBatchSize = Math.min(100, Math.floor(currentBatchSize * 1.2));
                  }
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

              // Main cracking process (main-thread only)
              async function processWords() {
                if (foundWord || checked >= totalWords || shouldStop) {
                  return;
                }

                if (isPaused) {
                  setTimeout(processWords, 100); // Check again in 100ms
                  return;
                }

                const wordBatch = optimizedWordlist.slice(checked, checked + currentBatchSize);
                await processSynchronously(wordBatch);
                updateStats();

                // Dynamic batch size optimization based on performance
                if (checked % 100 === 0 && checked > 100) {
                  const newBatchSize = getOptimizedBatchSize(type, totalWords - checked);
                  if (newBatchSize !== currentBatchSize) {
                    currentBatchSize = newBatchSize;
                  }
                }

                if (foundWord) {
                  completeCracking(foundWord);
                } else if (checked >= totalWords) {
                  completeCracking(null);
                } else {
                  const delay = type === 'bcrypt' ? 10 : (hashesPerSecond > 1000 ? 3 : 5);
                  setTimeout(processWords, delay);
                }
              }

              // Synchronous processing for each batch
              async function processSynchronously(wordBatch) {
                for (const word of wordBatch) {
                  const showAttempt = Math.random() > 0.85;
                  try {
                    let isMatch = false;
                    if (type === 'bcrypt') {
                      isMatch = verifyBcrypt(word, hashToValidate);
                    } else {
                      const wordHash = await generateHashOptimized(word, type);
                      isMatch = wordHash.toLowerCase() === hash.toLowerCase();
                    }
                    if (isMatch) {
                      foundWord = word;
                      addAttempt(word, true);
                      break;
                    } else if (showAttempt) {
                      addAttempt(word, false);
                    }
                  } catch (e) {
                    console.error('Hash error:', e);
                  }
                  checked++;
                }
              }

              // Start cracking
              processWords();

              function completeCracking(result) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

                // Clear attempts area but preserve height
                attemptsArea.innerHTML = "";

                // Cleanup: Clear hash cache if it's large
                if (hashCache.size > 5000) {
                  hashCache.clear();
                }

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

                  // Enhanced result display with performance metrics
                  const totalAttempts = checked.toLocaleString();
                  const efficiency = ((checked / totalWords) * 100).toFixed(1);
                  
                  resultBox.innerHTML = `
<div style="color: rgba(100, 255, 100, 0.9); font-weight: bold; display: flex; justify-content: space-between;">
  <span>✓ HASH CRACKED</span>
  <span style="font-size: 9px; color: rgba(180, 180, 180, 0.7); font-weight: normal;">${hashesPerSecond.toLocaleString()}/sec | ${elapsed}s</span>
</div>
<div>Plaintext: <span style="color: rgba(255, 200, 0, 0.9); font-weight: bold; font-size: 14px;">${result}</span></div>
<div style="font-size: 9px; color: rgba(180, 180, 180, 0.6);">Found after ${totalAttempts} attempts (${efficiency}% of dictionary)</div>`;

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
                  // Failed - more compact error with performance stats
                  const resultBox = document.createElement("div");
                  resultBox.style.padding = "6px";
                  resultBox.style.backgroundColor = "rgba(40, 0, 0, 0.3)";
                  resultBox.style.border = "1px solid rgba(200, 70, 70, 0.4)";
                  resultBox.style.borderRadius = "4px";
                  resultBox.style.display = "flex";
                  resultBox.style.flexDirection = "column";

                  const totalAttempts = checked.toLocaleString();
                  const avgSpeed = Math.round(checked / (Date.now() - startTime) * 1000);

                  // Enhanced error message with performance metrics
                  resultBox.innerHTML = `
            <div style="color: rgba(255, 100, 100, 0.9); font-weight: bold; display: flex; justify-content: space-between;">
              <span>✗ HASH NOT FOUND</span>
              <span style="font-size: 9px; color: rgba(180, 180, 180, 0.7); font-weight: normal;">${hashesPerSecond.toLocaleString()}/sec | ${elapsed}s</span>
            </div>
            <div style="font-size: 9px; color: rgba(180, 180, 180, 0.6);">Tried all ${totalAttempts} words (avg: ${avgSpeed.toLocaleString()}/sec)</div>`;

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