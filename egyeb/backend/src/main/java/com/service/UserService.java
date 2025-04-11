public Optional<User> findUserById(Long id) {
    return userRepository.findById(id);
}
