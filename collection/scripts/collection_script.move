script {
    use publisher::Collection;
 
    fun start_collection(account: &signer) {
        Collection::start_collection(account);
    }
}
