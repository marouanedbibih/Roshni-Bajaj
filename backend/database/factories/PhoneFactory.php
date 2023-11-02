<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Phone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Phone>
 */
class PhoneFactory extends Factory
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
            'value' => $this->faker->phoneNumber(),
            'customer_id' => $customer->id,
        ];
    }
}
