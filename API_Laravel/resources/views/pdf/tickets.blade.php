<style type="text/css">
    img{
        max-width: 250px;
        height: auto;
    }
    .header{
        border-bottom: 1px solid;
        padding-bottom: 20px;
        text-align: center;
    }

    .header-company{
        border-bottom: 1px dashed; 
        margin-bottom: 20px;
        padding-bottom: 20px;
        text-align: center;
    }

    h2{
        font-size: 20px;
        text-align: center;
    }

    .header-company p{
        text-align: right;
    }

    .date{
        text-align:  center;
        margin-bottom: 20px;
    }

    table,th,td{
        border-collapse: collapse;
        border: 1px solid rgb(5, 145, 170)
    }

    th, td{
        text-align: center;
        vertical-align: middle;
        width: 100px;
        max-width: 100px;
    }

    .th-title{
        width: 300px;
    }

    .td-title{
        text-align: left;
        padding-left: 5px;
        width: 300px;
    }

    .td-foot{
        border : none;
        padding: 10px;
    }

    .td-foot1{
        text-align: left;
    }

    .td-foot2{
        text-align: right;
    }

</style>


<div class="header">
    @if($xxx->logo)
        <img src="{{asset('images/'.$xxx->logo)}}">
    @endif
</div>

<div class='header-company'>
    <h2>{{$company->name}}</h2>
    @if($company->logo)
        <img src="{{asset('images/'.$company->logo)}}">
    @endif
    <p>{{$date}}</p>
</div>

<div class='date'>
    <p><b>Du {{$dateDebut}} au {{$dateFin}}</b></p>
</div>

<div>
    <table>
        <thead>
            <tr>
                @if($filterArrayFile['dateEmission'] == 1)
                <th>Emis le</th>
                @endif

                @if($filterArrayFile['step'] == 1)
                <th>Etape</th>
                @endif

                @if($filterArrayFile['dateResolution'] == 1)
                <th>Résolu le</th>
                @endif

                @if($filterArrayFile['priority'] == 1)
                <th>Priorité</th>
                @endif

                @if($filterArrayFile['requester'] == 1)
                <th>Demandeur</th>
                @endif

                @if($filterArrayFile['title'] == 1)
                <th class='th-title'>Titre</th>
                @endif

                @if($filterArrayFile['topic'] == 1)
                <th>Topic</th>
                @endif

                @if($filterArrayFile['duration'] == 1)
                <th>Temps de résolution</th>
                @endif
            </tr>
        </thead>
        <tbody>
            @foreach($tickets as $ticket) 
                <tr>
                    @if($filterArrayFile['dateEmission'] == 1)
                    <td>{{\Carbon\Carbon::parse($ticket->created_at)->isoFormat('L')}}</td>
                    @endif

                    @if($filterArrayFile['step'] == 1)
                    <td>{{$ticket->steps()->orderBy('pivot_created_at', 'desc')->first()->name}}</td>
                    @endif

                    @if($filterArrayFile['dateResolution'] == 1)
                        @if($ticket->steps()->orderBy('pivot_created_at', 'desc')->first()->id == 5)
                        <td>{{\Carbon\Carbon::parse($ticket->steps()->orderBy('pivot_created_at', 'desc')->first()->dateStepTicket)->isoFormat('L')}}</td>
                        @else   
                        <td>-</td>
                        @endif
                    @endif

                    @if($filterArrayFile['priority'] == 1)
                    <td>{{$ticket->priority()->first()->name}}</td>
                    @endif

                    @if($filterArrayFile['requester'] == 1)
                    <td>{{\App\User::where('id', $ticket->requester_id)->first()->name}} {{\App\User::where('id', $ticket->requester_id)->first()->firstname}}</td>
                    @endif

                    @if($filterArrayFile['title'] == 1)
                    <td class='td-title'>{{$ticket->title}}</td>
                    @endif

                    @if($filterArrayFile['topic'] == 1)
                    <td>{{$ticket->topic()->first()->name}}</td>
                    @endif

                    @if($filterArrayFile['duration'] == 1)
                    <td>{{$ticket->duration}} mn</td>
                    @endif
                </tr>
            @endforeach 
        </tbody>
        <tfoot>
            <tr>
                <td class="td-foot td-foot1" colspan="{{$nbColonnesLeft}}"><b><u>Nombre total de tickets</u></b> : {{count($tickets)}}</td>

                @php
                    $durationTotal = 0;
                    foreach($tickets as $ticket){
                        $duration = $ticket->duration;
                        $durationTotal = $durationTotal + $duration;
                    }
                    $hours = floor($durationTotal/60);
                    $minuts = $durationTotal - $hours*60;
                @endphp
                @if($filterArrayFile['duration'] == 1)
                <td class="td-foot td-foot2" colspan="{{$nbColonnesRight}}"><b><u>Total temps passé</u></b> : {{$hours}} h @if($minuts != 0){{$minuts}}@endif</td>
                @endif
            </tr>
        </tfoot>
    </table>
</div>
