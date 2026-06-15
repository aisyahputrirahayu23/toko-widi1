<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['supplier_id', 'name', 'price', 'stock', 'expired_date'];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
