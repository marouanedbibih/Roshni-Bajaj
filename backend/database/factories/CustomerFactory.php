<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Customer::class;

    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'birth_day' => $this->faker->date(),
            'birth_place' => $this->faker->city(),
            'country' => $this->faker->country(),
            'state' => $this->faker->state(),
            'city' => $this->faker->city(),
            'code_postal' => $this->faker->postcode(),
            'company' => $this->faker->company(),
            'job' => $this->faker->jobTitle(),
            'image' => $this->faker->imageUrl(),
        ];
    }
}
