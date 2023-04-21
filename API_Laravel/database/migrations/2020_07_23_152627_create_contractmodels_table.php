<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractmodelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contractmodels', function (Blueprint $table) {
            $table->id();
            $table->smallInteger('numberHours')->unisgned();
            $table->smallInteger('durationMonth')->unsigned()->default(12);
            $table->bigInteger('service_id')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contractmodels');
    }
}
