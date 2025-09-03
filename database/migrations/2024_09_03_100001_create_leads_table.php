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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('contact', 50);
            $table->string('address');
            $table->string('kebutuhan');
            $table->enum('status', ['new', 'contacted', 'qualified', 'lost'])->default('new');
            $table->foreignId('owner_user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['owner_user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
