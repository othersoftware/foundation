<?php

namespace OtherSoftware\Bridge\View\Directives;


class RenderFoundationHead
{
    public static function compile(): string
    {
        $template = '
            <?php foreach($initial[\'meta\'] ?? [] as $meta): ?>
                <?php if($meta[\'type\'] === \'title\'): ?>
                    <title data-fdn><?php echo $meta[\'content\'] ?></title>
                <?php endif; ?>
                
                <?php if($meta[\'type\'] === \'meta\'): ?>
                    <meta data-fdn name="<?php echo $meta[\'name\'] ?>" content="<?php echo $meta[\'content\'] ?>"/>
                <?php endif; ?>
                
                <?php if($meta[\'type\'] === \'snippet\'): ?>
                    <script data-fdn type="application/ld+json">
                      <?php echo $meta[\'content\'] ?>
                    </script>
                <?php endif; ?>
            <?php endforeach; ?>
        ';

        return implode('', array_map('trim', explode("\n", $template)));
    }
}
