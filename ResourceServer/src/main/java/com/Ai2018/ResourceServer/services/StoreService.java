package com.Ai2018.ResourceServer.services;

import com.Ai2018.ResourceServer.models.*;
import com.Ai2018.ResourceServer.repositories.AccountRepository;
import com.Ai2018.ResourceServer.repositories.ArchiveRepository;
import com.Ai2018.ResourceServer.repositories.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StoreService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    protected AccountRepository accountRepository;
    @Autowired
    private AccountService accountService;
    @Autowired
    private ArchiveRepository archiveRepository;

    public Invoice createInvoice(
            String username, List<String> itemId
    ) throws Exception
    { Invoice invoice = new Invoice();
            invoice.setAmount(itemId.stream()
                    .map(i -> archiveRepository.findById(i))
                    .map(Optional::get)
                    .map(Archive::getPrice)
                    .mapToDouble(Double::valueOf)
                    .sum());
            invoice.setUsername(username);
            invoice.setItems(itemId);
            invoice.setPaid(false);
            invoice.setCreatedAt((new Date()).getTime() / 1000);
            invoiceRepository.save(invoice);
            Account account = this.accountService.findAccountByUsername(username);
            this.accountService.grantRole(account, "CUSTOMER");
            this.accountService.update(account);
            return invoice;
    }

    @Transactional
    public Invoice payInvoice(String username, String invoiceId) throws Exception {

        //decrease wallet
        Invoice invoice = invoiceRepository.findByIdAndUsername(invoiceId, username);
        if(invoice == null){
            throw new Exception("Invoice " + invoiceId + " not found for user " + username);
        }
        Account buyer = accountRepository.findAccountByUsername(username);
        if(buyer == null)
            throw new Exception(username);
        if(buyer.getWallet() < invoice.getAmount())
            throw new Exception();//not enough money
        buyer.setWallet(buyer.getWallet() - invoice.getAmount());
        accountRepository.save(buyer);

        //pay sellers and increment counter
        List<Archive> items = invoice.getItems().stream()
                .filter(a->!buyer.getPurchasedArchives().contains(a)) //already bought
                .map(i-> archiveRepository.findById(i))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
       for(Archive item: items){
            Account seller = accountRepository.findAccountByUsername(item.getUserId());
            if(seller == null)
                throw new Exception(item.getUserId());
            seller.setWallet(seller.getWallet()+item.getPrice());
            item.addPurchases(1);
            archiveRepository.save(item);
            accountRepository.save(seller);
        }

        invoice.setPaid(true);
        invoiceRepository.save(invoice);
        return invoice;
    }

    @Transactional
    public Boolean cancelInvoice(String username, String invoiceId) throws Exception
    {
        Invoice invoice = invoiceRepository.findByIdAndUsername(invoiceId, username);
        if(invoice == null){
            throw new Exception("Invoice " + invoiceId + " not found for user " + username);
        }
        invoiceRepository.deleteById(invoiceId);
        return true;
    }

    @Transactional
    public List<Invoice> getInvoices(String username){
        return invoiceRepository.findByUsername(username);
    }
    @Transactional
    public Invoice getInvoice(String username, String invoiceId) throws Exception {
        Invoice invoice = invoiceRepository.findByIdAndUsername(invoiceId, username);
        if(invoice == null)
            throw new Exception("Invoice " + invoiceId + " not found for user " + username);
        return invoice;
    }

    public boolean hasPurchasedItem(String username, String archiveId) {
        Invoice invoice = invoiceRepository.findByUsernameAndItemsContaining(username, archiveId);
        return invoice != null && invoice.getPaid();
    }

    public List<String> getPurchasedItemIdsByUser(String username){
        List<Invoice> purchased = invoiceRepository.findInvoiceByUsernameAndIsPaidIsTrue(username);
        return purchased.stream().map(Invoice::getItems).flatMap(Collection::stream).collect(Collectors.toList());
    }

    public void buyArchives(String username, Invoice invoice) throws Exception{
        Account a = accountService.findAccountByUsername(username);
        a.addArchives(invoice.getItems().stream()
                .filter(id ->!a.getPurchasedArchives().contains(id)) //avoid duplicates
                .collect(Collectors.toList())
        );
        accountService.update(a);
    }
}