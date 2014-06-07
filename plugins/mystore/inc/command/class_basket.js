/** section: Plugins
 * MyStoreBasketAction
 * 
 * Gere le panier les actions du panier MyStore.
 * 
 **/
System.MyStoreBasketAction = {
	initialize:function(){
		
		//gestion du panier
		$$('table.mystore-basket').each(function(basket){
			
			basket.select('tbody tr').each(function(line){
				if(line.data('id') != null){
					var action = 	line.data('action');
					var id =		line.data('id').split('/');
					
					line.select('.input-button.qty').each(function(select){
					
						select.on('change', function(){
							window.location = action + '/' + id[0] +'/' + this.Value() +"/"+ id[1];
						});
							
					});
				}
			});
			
		});
		
		//gestion des adresses du panier
		$$('.mystore-switch-address').each(function(node){
			node.on('change', function(){
				if(this.Value()){
					$$('.mystore-content-address').invoke('hide');
				}else{
					$$('.mystore-content-address').invoke('show');
				}
			})
		});
		
		//gestion des options de livraison
		
		$$('.box-option-delivery').each(function(box){
			var price = box.data('price') * 1;
			var mode = 	box.data('mode');
			
			box.select('.set-cost-delivery').each(function(node){
				
				node.on('change', function(){
					if(this.Checked()){
						$$('.box-address.selected').invoke('removeClassName', 'selected');
						node.addClassName('selected');
						
						$$('.amount-delivery').each(function(cel){
							
							var cost = 		cel.data('cost-delivery').split(' ');
							
							var currency =	cost[1];
							cost =			(mode == 'add') ? (price + cost[0] * 1) : price;
							
							cel.innerHTML = (cost).format(2, ',', ' ') + ' ' + currency;
							
						});
						
						$$('.amount-total').each(function(cel){
							
							var cost = 		cel.data('cost-delivery').split(' ');
							
							var currency =	cost[1];
							cost =			mode == 'add' ? (price + cost[0] * 1) : price;
							
							var total = 	cel.data('amount').split(' ');
							cel.innerHTML = (total[0] * 1 + cost).format(2, ',', ' ') + ' ' + currency; 
						});
					}
				})
			});
			
		});
		
		//gestion des modes de paiement
		$$('.box-option-payment').each(function(box){
			box.on('click', function(){
				
				if(box.data('external')){
					
					window.location = System.URI + 'basket/action/payment/authorize/' + box.data('cardid');
					
				}else{
					
				}
				
			});
		});
	}
};

$WR.ready(function(){
	System.MyStoreBasketAction.initialize();
});