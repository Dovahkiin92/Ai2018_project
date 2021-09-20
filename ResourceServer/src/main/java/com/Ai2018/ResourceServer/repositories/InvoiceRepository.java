package com.Ai2018.ResourceServer.repositories;

import com.Ai2018.ResourceServer.models.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends MongoRepository<Invoice, String> {
    Invoice save(Invoice invoice);
    Invoice findByIdAndUsername(String id, String username);
    Invoice findByUsernameAndItemsContaining(String username, String archiveId);
    List<Invoice> findByUsername(String username);
    List<Invoice> findInvoiceByUsernameAndIsPaidIsTrue(String username);
    List<Invoice> findInvoiceByCreatedAtLessThanAndIsPaidIsFalse(Long timestamp);
    void deleteById(String id);
}