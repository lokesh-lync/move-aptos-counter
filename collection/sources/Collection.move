module publisher::Collection {

    use std::vector;
    use std::signer;
 
    struct Item has store, drop {
        id: u64,
        name: vector<u8>,
        qty: u64
    }

    struct Collection has key, store {
        items: vector<Item>
    }

    fun create_item(id: u64, name: vector<u8>, qty: u64): Item {
        Item { id, name, qty }
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
        assert!(check_exists(signer::address_of(account)), 0);
        let owner = signer::address_of(account);
        let collection = borrow_global<Collection>(owner);
        vector::length(&collection.items)
    }

    public fun add_item(account: &signer, name: vector<u8>, qty: u64) acquires Collection {
        let owner = signer::address_of(account);
        assert!(check_exists(owner), 0);
        let collection = borrow_global_mut<Collection>(owner);
        let last_id = vector::length(&collection.items);
        vector::push_back(&mut collection.items, create_item(last_id + 1, name, qty));
    }

    public fun find_item(account: &signer, _item_id: u64) acquires Collection { 
        let owner = signer::address_of(account);
        let _collection = borrow_global_mut<Collection>(owner);
        

 //       let (exists, index) = vector::index_of<Item>(&collection.items);
        /*
        let i = 0;
        while(i < total_item_in_collection){
            if(vector::contains<Item>())
            i = i + 1;
        }
        */
    }

    public fun destroy(account: &signer) acquires Collection {
        let owner = signer::address_of(account);
        assert!(check_exists(owner), 0);
        let collection = move_from<Collection>(owner);
        let Collection { items: _ } = collection;
    }
    // @todo - add more code
}
