script {
    use std::debug; // Standard library
    use publisher::counter; // Importing the module

    fun main() { // Main function
        
        let c = counter::get_count(@publisher); // Using the module
        debug::print(&c);

    }
}
