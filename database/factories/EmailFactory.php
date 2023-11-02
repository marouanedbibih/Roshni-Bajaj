<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Email;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Email>
 */
class EmailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition()
    {
        // Get an existing customer ID from the database
        $customer = Customer::inRandomOrder()->first();

        return [
            'key' => $this->faker->word(),
            'value' => $this->faker->email(),
            'customer_id' => $customer->id,
        ];
    }
}
