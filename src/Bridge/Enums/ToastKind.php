<?php

namespace OtherSoftware\Bridge\Enums;


enum ToastKind: string
{
    case SUCCESS = 'success';
    case DANGER = 'danger';
    case INFO = 'info';
    case WARNING = 'warning';
}
