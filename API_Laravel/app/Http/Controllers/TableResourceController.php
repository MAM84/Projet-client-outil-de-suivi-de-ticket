<?php

namespace App\Http\Controllers;

use App\Service;
use App\Priority;
use App\Topic;
use App\Step;
use Illuminate\Http\Request;

class TableResourceController extends Controller
{
    public function servicesList()
    {
        $services = Service::all();

        foreach ($services as $service) {
            $servicesList[] = [
                'id' => $service->id,
                'name' => $service->name,
            ];
        }
            return [
                'servicesList' => $servicesList,
            ];
    }

    public function prioritiesList()
    {
        $priorities = Priority::all();

        foreach ($priorities as $priority) {
            $prioritiesList[] = [
                'id' => $priority->id,
                'name' => $priority->name,
            ];
        }
            return [
                'prioritiesList' => $prioritiesList,
            ];
    }

    public function topicsList()
    {
        $topics = Topic::all();

        foreach ($topics as $topic) {
            $topicsList[] = [
                'id' => $topic->id,
                'name' => $topic->name,
            ];
        }
            return [
                'topicsList' => $topicsList,
            ];
    }

    public function stepsList()
    {
        $steps = Step::all();

        foreach ($steps as $step) {
            $stepsList[] = [
                'id' => $step->id,
                'name' => $step->name,
            ];
        }
            return [
                'stepsList' => $stepsList,
            ];
    }
}
