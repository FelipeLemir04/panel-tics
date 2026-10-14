<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_guests_are_redirected_from_the_dashboard_to_the_login(): void
    {
        $response = $this->get('/');

        $response->assertRedirect('/login');
    }
}
