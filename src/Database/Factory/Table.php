<?php

namespace OtherSoftware\Database\Factory;


use Doctrine\DBAL\Schema\Schema;
use Doctrine\DBAL\Schema\Table as SchemaTable;
use OtherSoftware\Database\Contracts\IStructureMaker;
use OtherSoftware\Database\Factory\Concerns\CreatesIndexes;
use OtherSoftware\Database\Factory\Concerns\CreatesStructure;
use OtherSoftware\Database\Factory\Concerns\CreatesTableConstraints;
use OtherSoftware\Database\Factory\Indexes\IndexFactory;


final class Table
{
    use CreatesStructure;
    use CreatesTableConstraints;
    use CreatesIndexes;


    /**
     * @var AbstractConstraint[]
     */
    private array $constraints = [];

    /**
     * @var IndexFactory[]
     */
    private array $indexes = [];

    private string $name;

    private int $optionAutoIncrement;

    private string $optionCharset = 'utf8mb4';

    private string $optionCollation = 'utf8mb4_unicode_ci';

    private string $optionComment;

    private string $optionEngine;

    private string $optionRowFormat;

    private Schema $schema;

    /**
     * @var IStructureMaker[]
     */
    private array $structure = [];


    public function __construct(string $name)
    {
        $this->name = $name;
    }


    public function make(Schema $schema): SchemaTable
    {
        $table = $schema->createTable($this->name);

        $table->addOption('charset', $this->optionCharset);
        $table->addOption('collate', $this->optionCollation);

        if (isset($this->optionAutoIncrement)) {
            $table->addOption('auto_increment', $this->optionAutoIncrement);
        }

        if (isset($this->optionComment)) {
            $table->addOption('comment', $this->optionComment);
        }

        if (isset($this->optionEngine)) {
            $table->addOption('engine', $this->optionEngine);
        }

        if (isset($this->optionRowFormat)) {
            $table->addOption('row_format', $this->optionRowFormat);
        }

        foreach ($this->structure as $maker) {
            $maker->make($table);
        }

        foreach ($this->constraints as $constraint) {
            $constraint->make($table);
        }

        foreach ($this->indexes as $index) {
            $index->make($table);
        }

        return $table;
    }


    public function setOptionAutoIncrement(int $optionAutoIncrement): Table
    {
        $this->optionAutoIncrement = $optionAutoIncrement;

        return $this;
    }


    public function setOptionCharset(string $optionCharset): Table
    {
        $this->optionCharset = $optionCharset;

        return $this;
    }


    public function setOptionCollation(string $optionCollation): Table
    {
        $this->optionCollation = $optionCollation;

        return $this;
    }


    public function setOptionComment(string $optionComment): Table
    {
        $this->optionComment = $optionComment;

        return $this;
    }


    public function setOptionEngine(string $optionEngine): Table
    {
        $this->optionEngine = $optionEngine;

        return $this;
    }


    public function setOptionRowFormat(string $optionRowFormat): Table
    {
        $this->optionRowFormat = $optionRowFormat;

        return $this;
    }
}
