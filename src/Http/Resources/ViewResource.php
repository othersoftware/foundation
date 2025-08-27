<?php

namespace OtherSoftware\Http\Resources;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;
use OtherSoftware\Contracts\Translatable;
use OtherSoftware\Database\Eloquent\Model as OtherSoftwareModel;


/**
 * @property Model $resource
 */
class ViewResource extends JsonResource
{
    private static bool $rendersForView = false;


    public static function rendersForView(): bool
    {
        return self::$rendersForView;
    }


    public function toArray(Request $request): array
    {
        // Keep the previous state, as we might render nested form resources.
        $previousState = static::$rendersForView;

        // Enable form render mode
        static::$rendersForView = true;

        $data = $this->resource->toArray();

        if ($this->resource instanceof Translatable) {
            $default = $this->resource->translateOrNew(config('app.fallback_locale'));

            foreach ($this->resource->translatedAttributes as $attribute) {
                data_set($data, Str::camel($attribute), $default->getAttribute($attribute));
            }
        }

        // Meta-section we want without the form render mode.
        static::$rendersForView = false;

        $data['meta'] = [];
        $data['meta']['exists'] = $this->resource->exists;
        $data['meta']['morphType'] = $this->resource->getMorphClass();
        $data['meta']['morphKey'] = $this->resource->getKey();
        $data['meta']['unix'] = [];

        if ($this->resource instanceof OtherSoftwareModel) {
            foreach ($this->resource->getSerializedDates() as $key => $value) {
                $data['meta'][$key] = $value;
                $data['meta']['unix'][$key] = $this->resource->getAttribute($key)?->unix();
            }

            foreach ($this->resource->getSerializedEnums() as $key => $value) {
                $data['meta'][$key] = $value;
            }

            $data = $this->resource->toViewResource($data);
        }


        // Finally, return to the previous render mode.
        static::$rendersForView = $previousState;

        return $data;
    }
}
