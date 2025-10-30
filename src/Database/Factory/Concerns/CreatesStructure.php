<?php

namespace OtherSoftware\Database\Factory\Concerns;


use OtherSoftware\Database\Contracts\IStructureMaker;
use OtherSoftware\Database\Factory\Presets\NestedSetPreset;
use OtherSoftware\Database\Factory\Presets\PageablePreset;
use OtherSoftware\Database\Factory\Presets\RememberTokenPreset;
use OtherSoftware\Database\Factory\Presets\SoftDeletesPreset;
use OtherSoftware\Database\Factory\Presets\TimestampsPreset;
use OtherSoftware\Database\Factory\Structure\BooleanStructure;
use OtherSoftware\Database\Factory\Structure\CharStructure;
use OtherSoftware\Database\Factory\Structure\DateStructure;
use OtherSoftware\Database\Factory\Structure\DateTimeStructure;
use OtherSoftware\Database\Factory\Structure\DecimalStructure;
use OtherSoftware\Database\Factory\Structure\FloatStructure;
use OtherSoftware\Database\Factory\Structure\ForeignCharStructure;
use OtherSoftware\Database\Factory\Structure\ForeignIdentifierStructure;
use OtherSoftware\Database\Factory\Structure\ForeignUuidStructure;
use OtherSoftware\Database\Factory\Structure\IdentifierStructure;
use OtherSoftware\Database\Factory\Structure\IntegerBigStructure;
use OtherSoftware\Database\Factory\Structure\IntegerSmallStructure;
use OtherSoftware\Database\Factory\Structure\IntegerStructure;
use OtherSoftware\Database\Factory\Structure\JsonStructure;
use OtherSoftware\Database\Factory\Structure\LongTextStructure;
use OtherSoftware\Database\Factory\Structure\MediumTextStructure;
use OtherSoftware\Database\Factory\Structure\MoneyStructure;
use OtherSoftware\Database\Factory\Structure\StringStructure;
use OtherSoftware\Database\Factory\Structure\TextStructure;
use OtherSoftware\Database\Factory\Structure\TimeStructure;
use OtherSoftware\Database\Factory\Structure\TinyTextStructure;
use OtherSoftware\Database\Factory\Structure\UuidStructure;


trait CreatesStructure
{
    public function bigInteger(string $name): IntegerBigStructure
    {
        return $this->makeStructure(new IntegerBigStructure($name));
    }


    public function boolean(string $name): BooleanStructure
    {
        return $this->makeStructure(new BooleanStructure($name));
    }


    public function char(string $name, int $length = 255): CharStructure
    {
        return $this->makeStructure(new CharStructure($name, $length));
    }


    public function date(string $name): DateStructure
    {
        return $this->makeStructure(new DateStructure($name));
    }


    public function datetime(string $name): DateTimeStructure
    {
        return $this->makeStructure(new DateTimeStructure($name));
    }


    public function decimal(string $name, int $precision = 10, int $scale = 2): DecimalStructure
    {
        return $this->makeStructure(new DecimalStructure($name, $precision, $scale));
    }


    public function float(string $name, int $precision = 10, int $scale = 0): FloatStructure
    {
        return $this->makeStructure(new FloatStructure($name, $precision, $scale));
    }


    public function foreignChar(string $name, int $length = 255): ForeignCharStructure
    {
        return $this->makeStructure(new ForeignCharStructure($name, $length));
    }


    public function foreignId(string $name): ForeignIdentifierStructure
    {
        return $this->makeStructure(new ForeignIdentifierStructure($name));
    }


    public function foreignUuid(string $name): ForeignUuidStructure
    {
        return $this->makeStructure(new ForeignUuidStructure($name));
    }


    public function id(string $name = 'id'): IdentifierStructure
    {
        return $this->makeStructure(new IdentifierStructure($name));
    }


    public function integer(string $name): IntegerStructure
    {
        return $this->makeStructure(new IntegerStructure($name));
    }


    public function json(string $name): JsonStructure
    {
        return $this->makeStructure(new JsonStructure($name));
    }


    public function longText(string $name): LongTextStructure
    {
        return $this->makeStructure(new LongTextStructure($name));
    }


    public function mediumText(string $name): MediumTextStructure
    {
        return $this->makeStructure(new MediumTextStructure($name));
    }


    public function money(string $name, int $precision = 19, int $scale = 4): MoneyStructure
    {
        return $this->makeStructure(new MoneyStructure($name, $precision, $scale));
    }


    public function morphs(string $name, ?string $index = null): void
    {
        $this->makeStructure(new StringStructure("{$name}_type", 255));
        $this->makeStructure(new IntegerBigStructure("{$name}_id"))->unsigned();

        $this->index(["{$name}_type", "{$name}_id"], $index);
    }


    public function nestedSet(): void
    {
        $this->makeStructure(new NestedSetPreset());
    }


    public function nullableMorphs(string $name, ?string $index = null): void
    {
        $this->makeStructure(new StringStructure("{$name}_type", 255))->nullable();
        $this->makeStructure(new IntegerBigStructure("{$name}_id"))->unsigned()->nullable();

        $this->index(["{$name}_type", "{$name}_id"], $index);
    }


    public function pageable(): void
    {
        $this->makeStructure(new PageablePreset());
    }


    public function rememberToken(): void
    {
        $this->makeStructure(new RememberTokenPreset());
    }


    public function smallInteger(string $name): IntegerSmallStructure
    {
        return $this->makeStructure(new IntegerSmallStructure($name));
    }


    public function softDeletes(): void
    {
        $this->makeStructure(new SoftDeletesPreset());
    }


    public function string(string $name, int $length = 255): StringStructure
    {
        return $this->makeStructure(new StringStructure($name, $length));
    }


    public function text(string $name): TextStructure
    {
        return $this->makeStructure(new TextStructure($name));
    }


    public function time(string $name): TimeStructure
    {
        return $this->makeStructure(new TimeStructure($name));
    }


    public function timestamp(string $name): DateTimeStructure
    {
        return $this->datetime($name);
    }


    public function timestamps(): void
    {
        $this->makeStructure(new TimestampsPreset());
    }


    public function tinyInteger(string $name): IntegerSmallStructure
    {
        // In DBAL tiny int is always treated as boolean, so use small int instead.
        return $this->smallInteger($name);
    }


    public function tinyText(string $name): TinyTextStructure
    {
        return $this->makeStructure(new TinyTextStructure($name));
    }


    public function unsignedBigInteger(string $name): IntegerBigStructure
    {
        return $this->bigInteger($name)->unsigned();
    }


    public function unsignedDecimal(string $name, int $precision = 10, int $scale = 2): DecimalStructure
    {
        return $this->decimal($name, $precision, $scale)->unsigned();
    }


    public function unsignedFloat(string $name, int $precision = 10, int $scale = 0): FloatStructure
    {
        return $this->float($name, $precision, $scale)->unsigned();
    }


    public function unsignedInteger(string $name): IntegerStructure
    {
        return $this->integer($name)->unsigned();
    }


    public function unsignedSmallInteger(string $name): IntegerSmallStructure
    {
        return $this->smallInteger($name)->unsigned();
    }


    public function unsignedTinyInteger(string $name): IntegerSmallStructure
    {
        // In DBAL tiny int is always treated as boolean, so use small int instead.
        return $this->smallInteger($name)->unsigned();
    }


    public function uuid(string $name = 'id'): UuidStructure
    {
        return $this->makeStructure(new UuidStructure($name));
    }


    /**
     * @template T
     *
     * @param T $structure
     *
     * @return T
     */
    private function makeStructure(IStructureMaker $structure): IStructureMaker
    {
        $this->structure[] = $structure;

        $structure->setTableFactory($this);
        $structure->boot();

        return $structure;
    }
}
