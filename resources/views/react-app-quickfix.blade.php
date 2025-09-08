<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>PT Smart CRM - Customer Relationship Management</title>

    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon">

    <!-- React App CSS - Hardcoded for immediate fix -->
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
            max-width: 500px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <!-- React App Mount Point -->
    <div id="root">
        <!-- Loading fallback -->
        <div class="loading-container">
            <div>
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading PT Smart CRM...</div>
            </div>
        </div>
    </div>

    <!-- Error handling -->
    <script>
        setTimeout(function() {
            const rootElement = document.getElementById('root');
            if (rootElement && rootElement.innerHTML.includes('loading-container')) {
                rootElement.innerHTML = `
                    <div class="error-container">
                        <div class="error-title">PT Smart CRM</div>
                        <div class="error-message">
                            The application is currently being set up. Please ensure that:<br><br>
                            1. Frontend assets have been built (npm run build)<br>
                            2. Assets have been copied to public/frontend/<br>
                            3. Database has been migrated<br><br>
                            If you continue to see this message, please contact the administrator.
                        </div>
                    </div>
                `;
            }
        }, 5000);
    </script>

    <!-- React App JavaScript - Hardcoded correct filenames -->
    <link rel="modulepreload" crossorigin href="{{ asset('frontend/assets/js/vendor-51280515.js') }}">
    <link rel="modulepreload" crossorigin href="{{ asset('frontend/assets/js/router-902ffa71.js') }}">
    <link rel="modulepreload" crossorigin href="{{ asset('frontend/assets/js/utils-63a63872.js') }}">
    <script type="module" crossorigin src="{{ asset('frontend/assets/js/index-528e8f55.js') }}" defer></script>

    <!-- Fallback untuk browser yang tidak mendukung modules -->
    <script nomodule>
        document.getElementById('root').innerHTML = `
            <div class="error-container">
                <div class="error-title">Browser Tidak Didukung</div>
                <div class="error-message">
                    Silakan gunakan browser modern seperti Chrome, Firefox, Safari, atau Edge versi terbaru.
                </div>
            </div>
        `;
    </script>
</body>
</html>
