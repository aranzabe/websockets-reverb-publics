<?php

namespace App\Http\Controllers;


use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function send(Request $request)
    {
        $msg = $request->input('message'); // <-- recoge el input
        event(new MessageSent($msg));      // <-- lo reenvía a los oyentes.
        return response()->json(['status'=>'ok']);
    }

}
