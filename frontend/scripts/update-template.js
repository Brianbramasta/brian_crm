const fs = require('fs');
const path = require('path');

// Path ke file yang perlu diupdate
const publicDir = path.join(__dirname, '../../public/frontend');
const templatePath = path.join(__dirname, '../../resources/views/react-app.blade.php');

function updateTemplate() {
    try {
        // Baca file index.html yang di-generate Vite
        const indexPath = path.join(publicDir, 'index.html');

        if (!fs.existsSync(indexPath)) {
            console.log('❌ File index.html tidak ditemukan di public/frontend');
            return;
        }

        const indexContent = fs.readFileSync(indexPath, 'utf8');

        // Extract CSS dan JS file names dari index.html
        const cssMatch = indexContent.match(/href="\/assets\/css\/(index-[a-f0-9]+\.css)"/);
        const jsMatch = indexContent.match(/src="\/assets\/js\/(index-[a-f0-9]+\.js)"/);

        if (!cssMatch || !jsMatch) {
            console.log('❌ Tidak bisa menemukan CSS atau JS files');
            return;
        }

        const cssFile = cssMatch[1];
        const jsFile = jsMatch[1];

        console.log('📦 CSS File:', cssFile);
        console.log('📦 JS File:', jsFile);

        // Baca template blade
        let templateContent = fs.readFileSync(templatePath, 'utf8');

        // Update CSS reference
        templateContent = templateContent.replace(
            /href="{{ asset\('frontend\/assets\/css\/[^']+'\) }}"/,
            `href="{{ asset('frontend/assets/css/${cssFile}') }}"`
        );

        // Update JS reference
        templateContent = templateContent.replace(
            /src="{{ asset\('frontend\/assets\/js\/[^']+'\) }}"/,
            `src="{{ asset('frontend/assets/js/${jsFile}') }}"`
        );

        // Tulis kembali template
        fs.writeFileSync(templatePath, templateContent);

        console.log('✅ Template blade berhasil diupdate!');
        console.log('🎯 CSS:', `frontend/assets/css/${cssFile}`);
        console.log('🎯 JS:', `frontend/assets/js/${jsFile}`);

    } catch (error) {
        console.error('❌ Error updating template:', error.message);
    }
}

// Jalankan script
updateTemplate();
