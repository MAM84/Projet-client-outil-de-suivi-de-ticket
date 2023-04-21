<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStepTicketTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('step_ticket', function (Blueprint $table) {
            $table->id();
            $table->date('dateStepTicket');
            $table->string('comment', 255)->nullable();
            $table->bigInteger('step_id')->unsigned();
            $table->bigInteger('ticket_id')->unsigned();
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
        Schema::dropIfExists('step_ticket');
    }
}
