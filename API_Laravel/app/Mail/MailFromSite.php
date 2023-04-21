<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailFromSite extends Mailable
{
    use Queueable, SerializesModels;

    protected $message;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from(config('mail.from.address'))
            ->view('emails.confirmTicket')
            ->subject($this->message['subject'])
            ->with([
                'userName' =>   $this->message['userName'],
                'userFirstName' =>   $this->message['userFirstName'],
                'userCompany' =>   $this->message['userCompany'],
                'titleticket' =>   $this->message['titleticket'],
                'descriptionticket' =>   $this->message['descriptionticket'],
                'topicticket' =>   $this->message['topicticket']
          ]);
    }
}
