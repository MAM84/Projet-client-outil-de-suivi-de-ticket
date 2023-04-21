<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // crée un champ id de type BIGINTEGER UNSIGNED et AUTOINCREMENT
            $table->string('name');
            $table->string('firstname')->nullable();
            $table->string('function')->nullable();
            $table->string('phone', '20')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('admin')->default(false);
            $table->bigInteger('company_id')->unsigned();
            $table->string('comment', '255')->nullable();
            $table->rememberToken(); // sécurise les formulaires
            $table->timestamps(); // génère un champ created at (date de création) et un champ updated at (date de dernière modification)
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
