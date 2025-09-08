<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>PT Smart CRM - Customer Relationship Management</title>

    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon">

    <!-- React App CSS - Dynamic asset loading -->
    @php
        $frontendPath = public_path('frontend/assets');
        $cssFiles = [];
        $jsFiles = [];

        // Get CSS files
        if (is_dir($frontendPath . '/css')) {
            $cssFiles = glob($frontendPath . '/css/index-*.css');
        }

        // Get JS files
        if (is_dir($frontendPath . '/js')) {
            $jsFiles = [
                'main' => glob($frontendPath . '/js/index-*.js'),
                'vendor' => glob($frontendPath . '/js/vendor-*.js'),
                'router' => glob($frontendPath . '/js/router-*.js'),
                'utils' => glob($frontendPath . '/js/utils-*.js')
            ];
        }
    @endphp

    @if(!empty($cssFiles))
        @foreach($cssFiles as $cssFile)
            <link rel="stylesheet" href="{{ asset('frontend/assets/css/' . basename($cssFile)) }}">
        @endforeach
    @else
        <!-- Fallback CSS -->
        <link rel="stylesheet" href="{{ asset('frontend/assets/css/index-1d875b6d.css') }}">
    @endif

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

    <!-- Error handling and loading detection -->
    <script>
        // Track if React app has loaded successfully
        let reactAppLoaded = false;

        // Set up error handling for module loading
        window.addEventListener('error', function(e) {
            if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
                console.error('Failed to load asset:', e.target.src || e.target.href);
                showErrorMessage();
            }
        });

        // Check if React app loaded after a reasonable time
        setTimeout(function() {
            const rootElement = document.getElementById('root');
            if (rootElement && rootElement.innerHTML.includes('loading-container')) {
                showErrorMessage();
            }
        }, 5000);

        // Function to show error message
        function showErrorMessage() {
            const rootElement = document.getElementById('root');
            if (rootElement) {
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
        }

        // Mark React app as loaded when it actually loads
        window.addEventListener('DOMContentLoaded', function() {
            // This will be overridden by React when it loads
            setTimeout(function() {
                const rootElement = document.getElementById('root');
                if (rootElement && !rootElement.innerHTML.includes('loading-container') && !rootElement.innerHTML.includes('error-container')) {
                    reactAppLoaded = true;
                }
            }, 1000);
        });
    </script>

    <!-- React App JavaScript - Dynamic asset loading -->
    @if(!empty($jsFiles['vendor']))
        @foreach($jsFiles['vendor'] as $vendorFile)
            <link rel="modulepreload" crossorigin href="{{ asset('frontend/assets/js/' . basename($vendorFile)) }}">
        @endforeach
    @endif

    @if(!empty($jsFiles['router']))
        @foreach($jsFiles['router'] as $routerFile)
            <link rel="modulepreload" crossorigin href="{{ asset('frontend/assets/js/' . basename($routerFile)) }}">
        @endforeach
    @endif

    @if(!empty($jsFiles['utils']))
        @foreach($jsFiles['utils'] as $utilsFile)
            <link rel="modulepreload" crossorigin href="{{ asset('frontend/assets/js/' . basename($utilsFile)) }}">
        @endforeach
    @endif

    @if(!empty($jsFiles['main']))
        @foreach($jsFiles['main'] as $mainFile)
            <script type="module" crossorigin src="{{ asset('frontend/assets/js/' . basename($mainFile)) }}" defer></script>
        @endforeach
    @else
        <!-- Fallback JS - Use the first available index file -->
        @php
            $fallbackIndexFiles = glob(public_path('frontend/assets/js/index-*.js'));
        @endphp
        @if(!empty($fallbackIndexFiles))
            <script type="module" src="{{ asset('frontend/assets/js/' . basename($fallbackIndexFiles[0])) }}" defer></script>
        @else
            <!-- Ultimate fallback if no index files found -->
            <script type="module" src="{{ asset('frontend/assets/js/index.js') }}" defer></script>
        @endif
    @endif

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
