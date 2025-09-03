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
            $table->string('address', 255);
            $table->string('kebutuhan', 255);
            $table->enum('status', ['new', 'contacted', 'qualified', 'lost'])->default('new');
            $table->unsignedBigInteger('owner_user_id');
            $table->timestamps();

            $table->foreign('owner_user_id')->references('id')->on('users');
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
