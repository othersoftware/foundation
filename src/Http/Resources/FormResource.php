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
class FormResource extends JsonResource
{
    private static bool $rendersForForm = false;


    public static function rendersForForm(): bool
    {
        return self::$rendersForForm;
    }


    public function toArray(Request $request): array
    {
        // Keep the previous state, as we might render nested form resources.
        $previousState = static::$rendersForForm;

        // Enable form render mode
        static::$rendersForForm = true;

        $data = $this->resource->toArray();

        if ($this->resource instanceof Translatable) {
            $this->resource->loadMissing('translations');

            foreach (config('translations.locales') as $locale) {
                data_set($data, $locale, FormResource::make($this->resource->translateOrNew($locale))->toArray($request));
            }

            $default = $this->resource->translateOrNew(config('app.fallback_locale'));

            foreach ($this->resource->translatedAttributes as $attribute) {
                data_set($data, Str::camel($attribute), $default->getAttribute($attribute));
            }
        }

        // Meta-section we want without the form render mode.
        static::$rendersForForm = false;

        $data['meta'] = [];
        $data['meta']['exists'] = $this->resource->exists;
        $data['meta']['morphType'] = $this->resource->getMorphClass();
        $data['meta']['morphKey'] = $this->resource->getKey();

        if ($this->resource instanceof OtherSoftwareModel) {
            foreach ($this->resource->getSerializedDates() as $key => $value) {
                $data['meta'][$key] = $value;
            }

            foreach ($this->resource->getSerializedEnums() as $key => $value) {
                $data['meta'][$key] = $value;
            }

            $data = $this->resource->toFormResource($data);
        }


        // Finally, return to the previous render mode.
        static::$rendersForForm = $previousState;

        return $data;
    }
}
