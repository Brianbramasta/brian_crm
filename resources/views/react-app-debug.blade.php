<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>PT Smart CRM - Customer Relationship Management</title>

    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon">

    <!-- Base URL for SPA routing -->
    <base href="/">

    <!-- React App CSS -->
    <link rel="stylesheet" href="{{ asset('frontend/assets/css/index-1d875b6d.css') }}">

    <style>
        /* Loading spinner styles */
        .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f8fafc;
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #e5e7eb;
            border-top: 5px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-text {
            margin-top: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            color: #6b7280;
            font-size: 16px;
        }

        /* Fallback styles if React fails to load */
        .error-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .error-title {
            font-size: 24px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 16px;
        }

        .error-message {
            font-size: 16px;
            color: #6b7280;
            text-align: center;
            max-width: 600px;
            line-height: 1.5;
        }

        .debug-info {
            margin-top: 20px;
            padding: 15px;
            background: #f3f4f6;
            border-radius: 8px;
            font-size: 12px;
            color: #4b5563;
            max-width: 600px;
        }
    </style>
</head>
<body>
    <!-- Debug info -->
    <script>
        console.log('PT Smart CRM Loading...');
        console.log('Current URL:', window.location.href);
        console.log('Assets base:', '{{ asset('frontend/assets') }}');
        console.log('Laravel environment:', '{{ app()->environment() }}');
    </script>

    <!-- React App Mount Point -->
    <div id="root">
        <!-- Loading fallback -->
        <div class="loading-container">
            <div>
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading PT Smart CRM...</div>
                <div class="debug-info">
                    URL: <span id="current-url"></span><br>
                    Time: <span id="load-time"></span><br>
                    Environment: {{ app()->environment() }}
                </div>
            </div>
        </div>
    </div>

    <!-- Initialize debug info -->
    <script>
        document.getElementById('current-url').textContent = window.location.href;
        document.getElementById('load-time').textContent = new Date().toLocaleString();
    </script>

    <!-- Fallback if React app files are not found -->
    <script>
        // Check if React app loaded after 8 seconds
        setTimeout(function() {
            const rootElement = document.getElementById('root');
            if (rootElement && rootElement.innerHTML.includes('loading-container')) {
                rootElement.innerHTML = `
                    <div class="error-container">
                        <div class="error-title">PT Smart CRM - Loading Issue</div>
                        <div class="error-message">
                            The React application failed to load properly. This might be due to:<br><br>
                            1. <strong>Missing Asset Files:</strong> CSS/JS files not found<br>
                            2. <strong>JavaScript Errors:</strong> Check browser console for errors<br>
                            3. <strong>Network Issues:</strong> Assets not loading from server<br>
                            4. <strong>Server Configuration:</strong> .htaccess or routing issues<br><br>
                            <strong>Current URL:</strong> ${window.location.href}<br>
                            <strong>Expected JS:</strong> {{ asset('frontend/assets/js/index-25f7e6c5.js') }}<br>
                            <strong>Expected CSS:</strong> {{ asset('frontend/assets/css/index-1d875b6d.css') }}
                        </div>
                        <div class="debug-info">
                            <strong>Debug Information:</strong><br>
                            Browser: ${navigator.userAgent}<br>
                            Load Time: ${new Date().toLocaleString()}<br>
                            Base URL: ${document.baseURI}<br>
                            Environment: {{ app()->environment() }}
                        </div>
                    </div>
                `;
            }
        }, 8000);
    </script>

    <!-- React App JavaScript -->
    <script type="module" src="{{ asset('frontend/assets/js/index-25f7e6c5.js') }}" defer></script>

    <!-- Error handling for script loading -->
    <script>
        window.addEventListener('error', function(e) {
            console.error('Script loading error:', e);
            if (e.target.src && e.target.src.includes('index-25f7e6c5.js')) {
                document.getElementById('root').innerHTML = `
                    <div class="error-container">
                        <div class="error-title">Asset Loading Error</div>
                        <div class="error-message">
                            <strong>Failed to load React application assets!</strong><br><br>
                            The JavaScript file could not be loaded from:<br>
                            <code>{{ asset('frontend/assets/js/index-25f7e6c5.js') }}</code><br><br>
                            Please ensure:<br>
                            1. Assets are properly deployed to production<br>
                            2. File permissions are correct (755)<br>
                            3. Path is accessible from web browser<br>
                            4. .htaccess rules are not blocking assets
                        </div>
                        <div class="debug-info">
                            Error: ${e.message}<br>
                            Source: ${e.target.src}<br>
                            Line: ${e.lineno}<br>
                            Time: ${new Date().toLocaleString()}
                        </div>
                    </div>
                `;
            }
        });
    </script>

    <!-- Fallback untuk browser yang tidak mendukung modules -->
    <script nomodule>
        document.getElementById('root').innerHTML = `
            <div class="error-container">
                <div class="error-title">Browser Tidak Didukung</div>
                <div class="error-message">
                    Browser Anda tidak mendukung ES6 modules yang diperlukan untuk aplikasi ini.<br><br>
                    Silakan gunakan browser modern seperti:<br>
                    • Chrome 61+<br>
                    • Firefox 60+<br>
                    • Safari 10.1+<br>
                    • Edge 16+
                </div>
            </div>
        `;
    </script>
</body>
</html>
