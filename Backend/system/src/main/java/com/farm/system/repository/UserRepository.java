package com.farm.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farm.system.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}