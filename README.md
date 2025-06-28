# En.Crypt

A sophisticated client-side cryptography toolkit with a retro-futuristic interface inspired by classic hacker aesthetics.

## Overview

En.Crypt is a web-based cryptographic demonstration tool that combines multiple encryption algorithms, file processing capabilities, and hash analysis features in an immersive terminal-style interface. The application features a dynamic binary matrix background effect and provides educational insights into various cryptographic methods.

## Features

### 🔐 Text Encryption
- **Multiple Algorithms**: AES-256, Caesar Cipher, DES, and RSA implementations
- **Real-time Processing**: Instant encryption and decryption with visual feedback
- **Security Features**: Password visibility toggle and secure key handling
- **User Experience**: Copy-to-clipboard functionality and error validation
- **Educational Value**: Algorithm-specific error messages and validation

### 📁 File Encryption
- **Advanced Algorithms**: AES-256, ZIP (AES), and 7-Zip (AES) support
- **File Processing**: Handle any file type with size validation
- **Progress Tracking**: Real-time encryption/decryption progress with detailed status
- **Download Management**: Secure download of processed files with proper extensions
- **Performance**: Optimized for files up to 50MB

### 🔍 Hash Reverse Engineering
- **Hash Types**: MD5, SHA1, and SHA256 support
- **Dictionary Attacks**: Built-in dictionary with 60+ common passwords
- **Custom Dictionaries**: Upload and use custom wordlists
- **Progress Visualization**: Real-time cracking attempts with success indicators
- **Educational Purpose**: Demonstrates hash vulnerability and security importance

## 🛠️ Technical Implementation

### Core Technologies
- **Frontend**: HTML5, CSS3, and Vanilla JavaScript (ES6+)
- **Animations**: GSAP (GreenSock Animation Platform) for smooth UI transitions
- **Cryptography**: Custom implementations for educational purposes
- **File Handling**: FileReader API for client-side file processing
- **Security**: All operations performed client-side for privacy

### Architecture
- **Modular Design**: Separate modules for each cryptographic function
- **Performance Optimized**: Binary matrix effect with requestAnimationFrame
- **Responsive Interface**: Adaptive terminal-style UI components
- **Error Handling**: Comprehensive validation and user feedback
- **Memory Management**: Efficient handling of large files and animations

### Cryptographic Implementations
- **AES-256**: Simplified demonstration version using Base64 encoding
- **DES**: Educational implementation with proper key padding
- **RSA**: Basic public-key encryption simulation
- **Caesar Cipher**: Classical shift cipher with full alphabet support
- **Hash Functions**: Dictionary-based reverse lookup for common passwords

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- Minimum 4GB RAM recommended for large file operations

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. No additional setup or dependencies required

### Quick Start Guide
1. **Text Encryption**: Select algorithm → Enter key → Input text → Encrypt/Decrypt
2. **File Encryption**: Choose file → Select algorithm → Set password → Process
3. **Hash Reverse**: Enter hash → Select type → Upload dictionary (optional) → Crack

## ⚠️ Important Security Notes

### Educational Purpose
- **Demonstration Only**: This application is designed for educational and demonstration purposes
- **Not Production Ready**: The cryptographic implementations are simplified for learning
- **Security Limitations**: Real-world encryption should use established libraries like OpenSSL

### Recommendations for Production Use
- Use industry-standard cryptographic libraries
- Implement proper key management systems
- Follow current security best practices and standards
- Consider using established encryption services for sensitive data

### Hash Cracking Ethics
- **Educational Use Only**: Hash reverse functionality is for learning about security vulnerabilities
- **Legal Compliance**: Only use on hashes you own or have explicit permission to analyze
- **Security Awareness**: Demonstrates why strong, unique passwords are essential

## 🎨 UI Features

### Visual Design
- **Matrix Effect**: Dynamic binary rain animation with mouse interaction
- **Terminal Aesthetic**: Retro-futuristic command-line interface styling
- **Responsive Layout**: Adapts to different screen sizes and orientations
- **Smooth Animations**: GSAP-powered transitions and effects

### User Experience
- **Intuitive Navigation**: Tab-based interface for different tools
- **Real-time Feedback**: Instant validation and progress indicators
- **Accessibility**: Keyboard navigation and screen reader support
- **Error Handling**: Clear, helpful error messages and recovery suggestions

## 📊 Performance Specifications

### File Size Limits
- **Optimal**: Files under 10MB for best performance
- **Maximum**: 50MB files supported (may experience slower processing)
- **Memory Usage**: Approximately 2-3x file size in RAM during processing

### Browser Compatibility
- **Chrome/Chromium**: 90+ (Recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS 14.5+, Android 10+

## 🔧 Development

### Project Structure
```
En.crypt/
├── index.html          # Main application entry point
├── styles.css          # UI styling and animations
├── script.js           # Core functionality and algorithms
├── logo.png           # Application icon
└── README.md          # Project documentation
```

### Code Organization
- **Matrix Animation**: Optimized binary rain effect with performance monitoring
- **Encryption Modules**: Separate classes for each cryptographic algorithm
- **UI Controllers**: Event handlers and interface management
- **File Processing**: Asynchronous file operations with progress tracking

### Contributing
This project is open for educational contributions:
1. Fork the repository
2. Create a feature branch
3. Implement improvements with proper documentation
4. Test across multiple browsers
5. Submit a pull request

## 📚 Educational Resources

### Cryptography Concepts Demonstrated
- **Symmetric Encryption**: AES, DES examples
- **Asymmetric Encryption**: RSA implementation basics
- **Classical Ciphers**: Caesar cipher mechanics
- **Hash Functions**: One-way function principles
- **Dictionary Attacks**: Common password vulnerability

### Learning Objectives
- Understand different encryption methodologies
- Recognize the importance of key management
- Learn about password security and common vulnerabilities
- Explore the balance between security and usability

## 📄 License

This project is released under the MIT License for educational use.

### Usage Rights
- ✅ Educational and personal use
- ✅ Code study and modification
- ✅ Non-commercial distribution
- ❌ Commercial use without attribution
- ❌ Claiming as original work

## 🚨 Disclaimer

**IMPORTANT**: The cryptographic operations in this application are simplified implementations designed for educational demonstration. They should **NOT** be relied upon for securing sensitive information in production environments.

For production cryptographic needs:
- Use established, peer-reviewed cryptographic libraries
- Follow current security standards (NIST, FIPS, etc.)
- Implement proper key management and secure coding practices
- Consider professional security auditing

**Remember**: This tool is for learning about cryptography concepts, not for actual data protection.
