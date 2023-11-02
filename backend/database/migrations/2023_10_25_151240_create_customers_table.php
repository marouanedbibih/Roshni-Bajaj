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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->date('birth_day')->nullable()->default(null);
            $table->string('birth_place')->nullable()->default(null);
            $table->string('country', 255);
            $table->string('state', 255);
            $table->string('city', 255);
            $table->string('code_postal')->nullable()->default(null);
            $table->string('company')->nullable();
            $table->string('job')->nullable();
            $table->text('image')->nullable();
            $table->timestamps(); // Add this line

            // $table->engine = 'InnoDB';

            // $table->index('last_name');
            // $table->index('first_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
