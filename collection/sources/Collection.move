module publisher::Collection {

    use 0x1::vector;
    use 0x1::signer;
 
    struct Item has store, drop {}

    struct Collection has key, store {
        items: vector<Item>
    }

    public fun start_collection(account: &signer) {
        move_to<Collection>(account, Collection { 
            items: vector::empty<Item>() 
        });
    }

    public fun check_exists(account: address): bool {
        exists<Collection>(account)
    }

    public fun size(account: &signer): u64 acquires Collection {
        let owner = signer::address_of(account);
        let collection = borrow_global<Collection>(owner);

        vector::length(&collection.items)
    }

    public fun add_item(account: &signer) acquires Collection {
        let owner = signer::address_of(account);
        let collection = borrow_global_mut<Collection>(owner);

        vector::push_back(&mut collection.items, Item {});
    }

    public fun destroy(account: &signer) acquires Collection {
        let owner = signer::address_of(account);
        let collection = move_from<Collection>(owner);

        let Collection { items: _ } = collection;
    }
}
