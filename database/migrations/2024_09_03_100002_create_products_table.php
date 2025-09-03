<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->decimal('hpp', 12, 2); // Harga Pokok Penjualan
            $table->decimal('margin_percent', 5, 2); // Margin percentage
            $table->decimal('harga_jual', 12, 2)->storedAs('hpp + (hpp * margin_percent / 100)'); // Auto-calculated selling price
            $table->timestamps();

            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
