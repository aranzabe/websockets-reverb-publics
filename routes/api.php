<?php

use App\Http\Controllers\Chatcontroller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/chat/send', [Chatcontroller::class, 'send']);
