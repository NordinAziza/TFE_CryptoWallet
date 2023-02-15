// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Marketplace{
    string public name;
    uint public productCount=0;

    mapping(uint => Product) public products;

    struct Product{  // structure du produit
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }
    // creation d' evenements
    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
        );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
        );

    constructor()  {
        name = 'Wallet';
    }
    

    function createProduct(string memory _name,uint _price) public{
        //verification des parametres
        require(bytes(_name).length>0);
        require(_price>0);
        //incrementation du nombre de produit
         productCount++;
        //crée le produit
        products[productCount]= Product(productCount,_name,_price,payable(msg.sender),false);
        //crée un evenement
        emit ProductCreated(productCount,_name,_price,payable(msg.sender),false);   // msg => variable global de la blockchain
        
    }

    function purchasedProduct(uint _id) public payable{
        // récuperation du produit
        Product memory _product = products[_id];
        // récuperation du vendeur
        address payable _seller = _product.owner;

        // verification d'id du produit
        require(_product.id > 0 &&  _product.id <= productCount);
        //verifiaction que l'acheteur a la monaie pour payer
        require(msg.value>=_product.price);
        //verifaction de le produit n'a pas deja été acheter
        require(!_product.purchased);
        //verifaction que l'achteur n'est pas le vendeur
        require(_seller!=msg.sender);

        //transfère de propriétere
        _product.owner = payable(msg.sender);
        //achat valider
        _product.purchased= true;
        //mise à jour du produit
        products[_id]=_product;
        //payement
        _seller.transfer(msg.value);
        //event)
        emit ProductPurchased(productCount,_product.name,_product.price,payable(msg.sender),true); 
    }
}