# En.Crypt

## Overview

En.Crypt is a client-side web application that provides encryption, decryption, and hash cracking functionalities with an aesthetically pleasing interface. It features a dynamic binary matrix background and a terminal-style UI.

## Features

### Text Encryption
- Support for multiple encryption algorithms (AES-256, Caesar Cipher)
- Encryption and decryption capabilities
- Password protection with visibility toggle
- Copy functionality for encrypted/decrypted content

### File Encryption
- Secure file encryption using AES-256
- Progress visualization with detailed status updates
- Support for any file type
- Download functionality for encrypted/decrypted files

### Hash Reverse
- Support for MD5, SHA1, and SHA256 hash types
- Dictionary-based hash cracking
- Real-time cracking progress visualization
- Custom dictionary file upload

## Technical Details

### Technologies Used
- HTML5, CSS3, and JavaScript
- GSAP (GreenSock Animation Platform) for animations
- CryptoJS (loaded dynamically) for hash operations

### UI Components
- Interactive binary matrix background that responds to mouse movement
- Terminal-style interface with custom controls
- Responsive design elements
- Animation-rich user experience

## Getting Started

1. Open the HTML file in a modern web browser
2. Choose between Text Encryption, File Encryption, or Hash Reverse tools
3. Follow the interface prompts to perform operations

## Usage Notes

- The encryption tools are for demonstration purposes
- For serious encryption needs, consider dedicated security tools
- Large files (>50MB) may cause performance issues in the browser
- Hash cracking is intended for educational purposes only

## Browser Compatibility

Tested and compatible with:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)

## License

This project is intended for educational and personal use only.

## Disclaimer

The cryptographic operations in this application are simplified for demonstration purposes and should not be relied upon for securing sensitive information in production environments.
