<?php

namespace OtherSoftware\Validation;


use BackedEnum;
use Brick\Math\BigNumber;
use Closure;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Validation\InvokableRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Fluent;
use Illuminate\Validation\ConditionalRules;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rules\ExcludeIf;
use Illuminate\Validation\Rules\Exists;
use Illuminate\Validation\Rules\In;
use Illuminate\Validation\Rules\NotIn;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rules\RequiredIf;
use Illuminate\Validation\Rules\Unique;
use Illuminate\Validation\Validator;
use OtherSoftware\Validation\Rules\Country;
use OtherSoftware\Validation\Rules\MaxUploadSize;
use OtherSoftware\Validation\Rules\RequiredWithExplicitAddress;
use OtherSoftware\Validation\Rules\RequiredWithImplicitAddress;
use UnitEnum;


final readonly class Constraint
{
    /**
     * The field under validation must be a value after a given date.
     * The dates will be passed into the `strtotime` PHP function in order
     * to be converted to a valid `DateTime` instance:
     *
     * ```
     * 'start_date' => 'required|date|after:tomorrow'
     * ```
     *
     * Instead of passing a date string to be evaluated by `strtotime`,
     * you may specify another field to compare against the date:
     *
     * ```
     * 'finish_date' => 'required|date|after:start_date'
     * ```
     *
     * @see https://laravel.com/docs/11.x/validation#rule-after
     *
     * @param string $date Date string compatible with `strtotime` function, or another field name.
     *
     * @return string
     */
    public static function after(string $date): string
    {
        return sprintf('after:%s', $date);
    }


    /**
     * The field under validation must be a value after or equal to
     * the given date. For more information, see the `after` rule.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-after-or-equal
     *
     * @param string $date Date string compatible with `strtotime` function, or another field name.
     *
     * @return string
     */
    public static function afterOrEqual(string $date): string
    {
        return sprintf('after_or_equal:%s', $date);
    }


    public static function array(): string
    {
        return 'array';
    }


    /**
     * The field under validation must be a value preceding the given date.
     * The dates will be passed into the PHP `strtotime` function in order
     * to be converted into a valid DateTime instance.
     *
     * In addition, like the after rule, the name of another field under
     * validation may be supplied as the value of date.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-before
     *
     * @param string $date Date string compatible with `strtotime` function, or another field name.
     *
     * @return string
     */
    public static function before(string $date): string
    {
        return sprintf('before:%s', $date);
    }


    /**
     * The field under validation must be a value preceding or equal to the
     * given date. The dates will be passed into the PHP strtotime function
     * in order to be converted into a valid DateTime instance.
     *
     * In addition, like the after rule, the name of another field under
     * validation may be supplied as the value of date.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-before-or-equal
     *
     * @param string $date Date string compatible with `strtotime` function, or another field name.
     *
     * @return string
     */
    public static function beforeOrEqual(string $date): string
    {
        return sprintf('before_or_equal:%s', $date);
    }


    /**
     * The field under validation must have a size between
     * the given min and max (inclusive). Strings, numerics, arrays, and files
     * are evaluated in the same fashion as the size rule.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-between
     *
     * @param mixed $min
     * @param mixed $max
     *
     * @return string
     */
    public static function between(mixed $min, mixed $max): string
    {
        return sprintf('between:%s,%s', $min, $max);
    }


    public static function boolean(): string
    {
        return 'boolean';
    }


    public static function confirmed(): string
    {
        return 'confirmed';
    }


    /**
     * The field under validation must be a valid country code following
     * the ISO 3166-1 Alpha 2 specification.
     *
     * @return Country
     */
    public static function country(): Country
    {
        return new Country();
    }


    public static function currentPassword(): string
    {
        return 'current_password';
    }


    /**
     * @param-closure-this Validator $custom
     * @param Closure(string $attribute, mixed $value, Closure $fail, Validator $validator): void $custom
     *
     * @return Closure
     */
    public static function custom(Closure $custom): callable
    {
        return $custom;
    }


    /**
     * The field under validation must be a valid, non-relative date according
     * to the `strtotime` PHP function.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-date
     *
     * @return string
     */
    public static function date(): string
    {
        return 'date';
    }


    public static function email(): string
    {
        return 'email';
    }


    /**
     * The Enum rule is a class based rule that validates whether the field
     * under validation contains a valid enum value. The Enum rule accepts
     * the name of the enum as its only constructor argument. When validating
     * primitive values, a backed Enum should be provided to the Enum rule.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-enum
     *
     * @param class-string $type
     * @param callable|null $callback
     *
     * @return Enum
     */
    public static function enum(string $type, callable $callback = null): Enum
    {
        $rule = new Enum($type);

        if (is_null($callback)) {
            return $rule;
        }

        $callback($rule);

        return $rule;
    }


    /**
     * The field under validation will be excluded from the request data
     * returned by the `validate` and `validated` methods.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-exclude
     *
     * @return string
     */
    public static function exclude(): string
    {
        return 'exclude';
    }


    /**
     * The field under validation will be excluded from the request data
     * returned by the `validate` and `validated` methods if the anotherfield
     * field is equal to value.
     *
     * If complex conditional exclusion logic is required, you may utilize
     * the `Rule::excludeIf` method. This method accepts a boolean or a closure.
     * When given a closure, the closure should return true or false to
     * indicate if the field under validation should be excluded:
     *
     * ```
     * use Illuminate\Support\Facades\Validator;
     * use OtherCommerce\Foundation\Validation\Constraint;
     *
     * Validator::make($request->all(), [
     *   'role_id' => Constraint::excludeIf($request->user()->is_admin),
     * ]);
     *
     * Validator::make($request->all(), [
     *   'role_id' => Constraint::excludeIf(fn () => $request->user()->is_admin),
     * ]);
     * ```
     *
     * @see https://laravel.com/docs/11.x/validation#rule-exclude-if
     *
     * @param string|bool|callable $field
     * @param mixed|null $value
     *
     * @return ExcludeIf|string
     */
    public static function excludeIf(string|bool|callable $field, mixed $value = null): ExcludeIf|string
    {
        if (is_string($field)) {
            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            }

            return sprintf('exclude_if:%s,%s', $field, $value);
        }

        return Rule::excludeIf($field);
    }


    /**
     * The field under validation will be excluded from the request data
     * returned by the `validate` and `validated` methods unless anotherfield's
     * field is equal to value. If value is `null` (`exclude_unless:name,null`),
     * the field under validation will be excluded unless the comparison field
     * is null or the comparison field is missing from the request data.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-exclude-unless
     *
     * @param string|bool $field
     * @param mixed $value
     *
     * @return string
     */
    public static function excludeUnless(string|bool $field, mixed $value): string
    {
        if (is_bool($value)) {
            $value = $value ? 'true' : 'false';
        }

        return sprintf('exclude_unless:%s,%s', $field, $value);
    }


    /**
     * The field under validation will be excluded from the request data
     * returned by the `validate` and `validated` methods if the *anotherfield*
     * field is present.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-exclude-with
     *
     * @param string $anotherfield
     *
     * @return string
     */
    public static function excludeWith(string $anotherfield): string
    {
        return sprintf('exclude_with:%s', $anotherfield);
    }


    /**
     * The field under validation will be excluded from the request data
     * returned by the `validate` and `validated` methods if the *anotherfield*
     * field is not present.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-exclude-without
     *
     * @param string $anotherfield
     *
     * @return string
     */
    public static function excludeWithout(string $anotherfield): string
    {
        return sprintf('exclude_without:%s', $anotherfield);
    }


    /**
     * The field under validation must exist in a given database table.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-exists
     *
     * @param string|class-string<Model> $table
     * @param string|callable $column
     * @param callable|null $callback
     *
     * @return Exists
     */
    public static function exists(string $table, string|callable $column = 'NULL', callable $callback = null): Exists
    {
        if (is_callable($column)) {
            $callback = $column;
            $column = 'NULL';
        }

        $rule = Rule::exists($table, $column);

        if (is_null($callback)) {
            return $rule;
        }

        $callback($rule);

        return $rule;
    }


    public static function file(): string
    {
        return 'file';
    }


    /**
     * The field under validation must be greater than the given field or value.
     * The two fields must be of the same type. Strings, numerics, arrays,
     * and files are evaluated using the same conventions as the `size` rule.
     *
     * @param string $field
     *
     * @return string
     */
    public static function gt(string $field): string
    {
        return sprintf('gt:%s', $field);
    }


    /**
     * The field under validation must be greater than or equal to the given
     * field or value. The two fields must be of the same type. Strings,
     * numerics, arrays, and files are evaluated using the same
     * conventions as the `size` rule.
     *
     * @param string $field
     *
     * @return string
     */
    public static function gte(string $field): string
    {
        return sprintf('gte:%s', $field);
    }


    public static function image(): string
    {
        return 'image';
    }


    /**
     * The field under validation must be included in the given list of values.
     * Since this rule often requires you to `implode` an array, the `Rule::in`
     * method may be used to fluently construct the rule:
     *
     * ```
     * use Illuminate\Support\Facades\Validator;
     * use OtherCommerce\Foundation\Validation\Constraint;
     *
     * Validator::make($data, [
     *     'zones' => [
     *         Constraint::required(),
     *         Constraint::in(['first-zone', 'second-zone']),
     *     ],
     * ]);
     * ```
     *
     * When the `in` rule is combined with the `array` rule, each value in
     * the input array must be present within the list of values provided to
     * the `in` rule. In the following example, the `LAS` airport code in
     * the input array is invalid since it is not contained in the list of
     * airports provided to the `in` rule:
     *
     * ```
     * use Illuminate\Support\Facades\Validator;
     * use OtherCommerce\Foundation\Validation\Constraint;
     *
     * $input = [
     *     'airports' => ['NYC', 'LAS'],
     * ];
     *
     * Validator::make($input, [
     *     'airports' => [
     *         Constraint::required(),
     *         Constraint::array(),
     *     ],
     *     'airports.*' => Constraint::in(['NYC', 'LIT']),
     * ]);
     * ```
     *
     * @see https://laravel.com/docs/11.x/validation#rule-in
     *
     * @param Arrayable|BackedEnum|UnitEnum|array|string $values
     *
     * @return In
     */
    public static function in(mixed $values): In
    {
        return Rule::in($values);
    }


    /**
     * The field under validation must be an integer.
     *
     * IMPORTANT!
     * This validation rule does not verify that the input is of the "integer"
     * variable type, only that the input is of a type accepted by PHP's
     * `FILTER_VALIDATE_INT` rule. If you need to validate the input as being
     * a number please use this rule in combination with
     * the `numeric` validation rule.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-integer
     *
     * @return string
     */
    public static function integer(): string
    {
        return 'integer';
    }


    public static function lowercase(): string
    {
        return 'lowercase';
    }


    public static function max(BigNumber|string|float|int $max): string
    {
        return sprintf('max:%s', $max);
    }


    public static function maxUploadSize(): string
    {
        return (string) (new MaxUploadSize());
    }


    public static function mimes(string|array $allowed): string
    {
        $allowed = is_array($allowed) ? implode(',', $allowed) : $allowed;

        return sprintf('mimes:%s', $allowed);
    }


    public static function min(BigNumber|string|float|int $min): string
    {
        return sprintf('min:%s', $min);
    }


    /**
     * The field under validation must be a multiple of value.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-multiple-of
     *
     * @param BigNumber|float|string|int $value
     *
     * @return string
     */
    public static function multipleOf(BigNumber|string|float|int $value): string
    {
        return sprintf('multiple_of:%s', $value);
    }


    /**
     * The field under validation must not be included in the given
     * list of values. The `Constraint::notIn` method may be used
     * to fluently construct the rule:
     *
     * ```
     * use Illuminate\Support\Facades\Validator;
     * use OtherCommerce\Foundation\Validation\Constraint;
     *
     * Validator::make($data, [
     *   'toppings' => [
     *     Constraint::required(),
     *     Constraint::notIn(['sprinkles', 'cherries']),
     *   ],
     * ]);
     * ```
     *
     * @see https://laravel.com/docs/11.x/validation#rule-not-in
     *
     * @param Arrayable|BackedEnum|UnitEnum|array|string $values
     *
     * @return NotIn
     */
    public static function notIn(mixed $values): NotIn
    {
        return Rule::notIn($values);
    }


    public static function nullable(): string
    {
        return 'nullable';
    }


    public static function numeric(): string
    {
        return 'numeric';
    }


    public static function password($callback = null): Password|null
    {
        return Password::defaults($callback);
    }


    public static function phone(string $country = null): string
    {
        return sprintf('phone:%s', $country ?: config('app.country'));
    }


    public static function present(): string
    {
        return 'present';
    }


    /**
     * The field under validation must be present in the input data and
     * not empty. A field is "empty" if it meets one of the following criteria:
     *
     * <ul>
     * <li>The value is null.</li>
     * <li>The value is an empty string.</li>
     * <li>The value is an empty array or empty Countable object.</li>
     * <li>The value is an uploaded file with no path.</li>
     * </ul>
     *
     * @see https://laravel.com/docs/11.x/validation#rule-required
     *
     * @return string
     */
    public static function required(): string
    {
        return 'required';
    }


    /**
     * The field under validation must be present and not empty if the
     * `field` is equal to any `value`. For more complex conditions this method
     * accepts a boolean or a closure. When passed a closure, the closure
     * should return `true` or `false` to indicate if the field under
     * validation is required.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-required-if
     *
     * @param string|bool|callable $field
     * @param mixed|null $value
     *
     * @return RequiredIf|string
     */
    public static function requiredIf(string|bool|callable $field, mixed $value = null): RequiredIf|string
    {
        if (is_string($field)) {
            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            }

            return sprintf('required_if:%s,%s', $field, $value);
        }

        return Rule::requiredIf($field);
    }


    /**
     * The field under validation must be present and not empty only if
     * any of the other specified fields are present and not empty.
     *
     * @param string|string[] ...$parameters
     *
     * @return string
     */
    public static function requiredWith(array|string $parameters): string
    {
        return sprintf('required_with:%s', implode(',', is_array($parameters) ? $parameters : func_get_args()));
    }


    /**
     * The field under validation must be present and not empty only if
     * the *countryfield* is one of countries with explicit addresses.
     *
     * @param string $countryField
     *
     * @return RequiredWithExplicitAddress
     */
    public static function requiredWithExplicitAddress(string $countryField): RequiredWithExplicitAddress
    {
        return new RequiredWithExplicitAddress($countryField);
    }


    /**
     * The field under validation must be present and not empty only if
     * the *countryField* is one of countries with implicit addresses.
     *
     * @param string $countryField
     *
     * @return RequiredWithImplicitAddress
     */
    public static function requiredWithImplicitAddress(string $countryField): RequiredWithImplicitAddress
    {
        return new RequiredWithImplicitAddress($countryField);
    }


    /**
     * The field under validation must be present and not empty only if
     * any of the other specified fields are not present or empty.
     *
     * @param string|string[] ...$parameters
     *
     * @return string
     */
    public static function requiredWithout(array|string $parameters): string
    {
        return sprintf('required_without:%s', implode(',', is_array($parameters) ? $parameters : func_get_args()));
    }


    public static function size(mixed $value): string
    {
        return sprintf('size:%s', $value);
    }


    /**
     * In some situations, you may wish to run validation checks against a field
     * only if that field is present in the data being validated. To quickly
     * accomplish this, add the `sometimes` rule to your rule list.
     *
     * @see https://laravel.com/docs/11.x/validation#validating-when-present
     *
     * @return string
     */
    public static function sometimes(): string
    {
        return 'sometimes';
    }


    public static function string(): string
    {
        return 'string';
    }


    public static function unique(string $table, string|callable $column = 'NULL', callable $callback = null): Unique
    {
        if (is_callable($column)) {
            $callback = $column;
            $column = 'NULL';
        }

        $rule = Rule::unique($table, $column);

        if (is_null($callback)) {
            return $rule;
        }

        $callback($rule);

        return $rule;
    }


    /**
     * The field under validation must be a valid URL.
     *
     * If you would like to specify the URL protocols that should be considered
     * valid, you may pass the protocols as validation rule parameters.
     *
     * @see https://laravel.com/docs/11.x/validation#rule-url
     *
     * @param array $protocols
     *
     * @return string
     */
    public static function url(array $protocols = []): string
    {
        if (count($protocols) > 0) {
            return sprintf('url:%s', join(',', $protocols));
        }

        return 'url';
    }


    /**
     * Apply the given rules if the given condition is truthy.
     *
     * @param Closure(Fluent $data): bool|bool $condition
     * @param ValidationRule|InvokableRule|\Illuminate\Contracts\Validation\Rule|Closure(Fluent $data): bool|array|string $rules
     * @param ValidationRule|InvokableRule|\Illuminate\Contracts\Validation\Rule|Closure(Fluent $data): bool|array|string $defaultRules
     *
     * @return ConditionalRules
     */
    public static function when($condition, $rules, $defaultRules = []): ConditionalRules
    {
        return Rule::when($condition, $rules, $defaultRules);
    }
}
