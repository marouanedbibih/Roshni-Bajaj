<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'birth_day' => $this->birth_day,
            'birth_place' => $this->birth_place,
            'country' => $this->country,
            'state' => $this->state,
            'city' => $this->city,
            'code_postal' => $this->code_postal,
            'company' => $this->company,
            'job' => $this->job,
            'image' => $this->image,
        ];
    }
}
