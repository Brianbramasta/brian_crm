<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>PT Smart CRM - Debug Mode</title>

    <!-- Debug Information -->
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

        // Debug: Check what files exist
        $debugInfo = [
            'frontend_path' => $frontendPath,
            'css_dir_exists' => is_dir($frontendPath . '/css'),
            'js_dir_exists' => is_dir($frontendPath . '/js'),
            'css_files_found' => $cssFiles,
            'js_files_found' => $jsFiles,
            'all_js_files' => is_dir($frontendPath . '/js') ? glob($frontendPath . '/js/*') : [],
            'all_css_files' => is_dir($frontendPath . '/css') ? glob($frontendPath . '/css/*') : []
        ];
    @endphp

    <style>
        body {
            font-family: monospace;
            padding: 20px;
            background: #f5f5f5;
        }
        .debug-section {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #007cba;
        }
        .debug-title {
            font-weight: bold;
            color: #007cba;
            margin-bottom: 10px;
        }
        .file-list {
            background: #f8f8f8;
            padding: 10px;
            border-radius: 3px;
        }
        .error { color: #d32f2f; }
        .success { color: #388e3c; }
    </style>
</head>
<body>
    <h1>PT Smart CRM - Debug Information</h1>

    <div class="debug-section">
        <div class="debug-title">🔍 Directory Check</div>
        <p><strong>Frontend Path:</strong> {{ $debugInfo['frontend_path'] }}</p>
        <p><strong>CSS Directory Exists:</strong>
            <span class="{{ $debugInfo['css_dir_exists'] ? 'success' : 'error' }}">
                {{ $debugInfo['css_dir_exists'] ? 'Yes' : 'No' }}
            </span>
        </p>
        <p><strong>JS Directory Exists:</strong>
            <span class="{{ $debugInfo['js_dir_exists'] ? 'success' : 'error' }}">
                {{ $debugInfo['js_dir_exists'] ? 'Yes' : 'No' }}
            </span>
        </p>
    </div>

    <div class="debug-section">
        <div class="debug-title">📁 All CSS Files Found</div>
        <div class="file-list">
            @if(!empty($debugInfo['all_css_files']))
                @foreach($debugInfo['all_css_files'] as $file)
                    <p>{{ basename($file) }}</p>
                @endforeach
            @else
                <p class="error">No CSS files found</p>
            @endif
        </div>
    </div>

    <div class="debug-section">
        <div class="debug-title">📁 All JS Files Found</div>
        <div class="file-list">
            @if(!empty($debugInfo['all_js_files']))
                @foreach($debugInfo['all_js_files'] as $file)
                    <p>{{ basename($file) }}</p>
                @endforeach
            @else
                <p class="error">No JS files found</p>
            @endif
        </div>
    </div>

    <div class="debug-section">
        <div class="debug-title">🎯 Filtered CSS Files (index-*.css)</div>
        <div class="file-list">
            @if(!empty($debugInfo['css_files_found']))
                @foreach($debugInfo['css_files_found'] as $file)
                    <p class="success">{{ basename($file) }}</p>
                @endforeach
            @else
                <p class="error">No index-*.css files found</p>
            @endif
        </div>
    </div>

    <div class="debug-section">
        <div class="debug-title">🎯 Filtered JS Files</div>
        @foreach(['main', 'vendor', 'router', 'utils'] as $type)
            <p><strong>{{ ucfirst($type) }} files ({{ $type }}-*.js):</strong></p>
            <div class="file-list">
                @if(!empty($debugInfo['js_files_found'][$type]))
                    @foreach($debugInfo['js_files_found'][$type] as $file)
                        <p class="success">{{ basename($file) }}</p>
                    @endforeach
                @else
                    <p class="error">No {{ $type }}-*.js files found</p>
                @endif
            </div>
        @endforeach
    </div>

    <div class="debug-section">
        <div class="debug-title">🔗 Asset URLs That Would Be Generated</div>
        <div class="file-list">
            <p><strong>CSS Links:</strong></p>
            @if(!empty($cssFiles))
                @foreach($cssFiles as $cssFile)
                    <p>{{ asset('frontend/assets/css/' . basename($cssFile)) }}</p>
                @endforeach
            @else
                <p class="error">No CSS links would be generated</p>
            @endif

            <p><strong>JS Links:</strong></p>
            @if(!empty($jsFiles['main']))
                @foreach($jsFiles['main'] as $mainFile)
                    <p>{{ asset('frontend/assets/js/' . basename($mainFile)) }}</p>
                @endforeach
            @else
                <p class="error">No main JS links would be generated</p>
            @endif
        </div>
    </div>

    <div class="debug-section">
        <div class="debug-title">💡 Recommendations</div>
        <div class="file-list">
            @if(empty($debugInfo['js_files_found']['main']))
                <p class="error">❌ No index-*.js files found. You need to build your React app first!</p>
                <p>Run: <code>npm run build</code> in your frontend directory</p>
            @else
                <p class="success">✅ Main JS files found</p>
            @endif

            @if(empty($debugInfo['css_files_found']))
                <p class="error">❌ No index-*.css files found. CSS assets are missing!</p>
            @else
                <p class="success">✅ CSS files found</p>
            @endif

            @if(!$debugInfo['js_dir_exists'] || !$debugInfo['css_dir_exists'])
                <p class="error">❌ Asset directories missing. Check your folder structure!</p>
            @else
                <p class="success">✅ Asset directories exist</p>
            @endif
        </div>
    </div>

    <div class="debug-section">
        <div class="debug-title">🔄 Next Steps</div>
        <div class="file-list">
            <ol>
                <li>If no files are found, build your React app: <code>npm run build</code></li>
                <li>Copy the built files to <code>public/frontend/assets/</code></li>
                <li>Upload all files to your cPanel</li>
                <li>Clear any server-side cache</li>
                <li>Replace this debug template with the normal react-app.blade.php</li>
            </ol>
        </div>
    </div>
</body>
</html>
