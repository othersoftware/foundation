<?php

namespace OtherSoftware\Http\Resources;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
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
        static::$rendersForForm = true;

        $data = $this->resource->toArray();

        if ($this->resource instanceof Translatable) {
            foreach (config('translations.locales') as $locale) {
                data_set($data, $locale, $this->resource->translateOrNew($locale)->toArray());
            }

            $default = $this->resource->translateOrNew(config('app.fallback_locale'));

            foreach ($this->resource->translatedAttributes as $attribute) {
                data_set($data, $attribute, $default->getAttribute($attribute));
            }
        }

        static::$rendersForForm = false;

        $data['meta'] = [];
        $data['meta']['exists'] = $this->resource->exists;

        if ($this->resource instanceof OtherSoftwareModel) {
            foreach ($this->resource->getSerializedDates() as $key => $value) {
                $data['meta'][$key] = $value;
            }
        }

        return $data;
    }
}
