<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's account page, where they can change their password.
     */
    public function edit(): Response
    {
        return Inertia::render('Profile/Edit');
    }
}
