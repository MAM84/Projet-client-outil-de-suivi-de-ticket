# Projet client outil de suivi de ticket

Projet client en conditions réelles effectué en équipe de 4 durant la formation.

(Le client a été très satisfait du travail rendu et m'a demandé de travailler sur quelques développements supplémentaires après la formation)

OUTIL DE GESTION EN LIGNE 
Pour le client : Suivi de contrat de maintenance et création/suivi des tickets
Pour l’administrateur : Vue d’ensemble des clients, leurs contrats et leurs tickets. Egalement un compte rendu des tâches effectuées.


Cahier des charges

I - Contexte
XXX est une agence de communication numérique dont XXX est le fondateur. Elle  propose des solutions de sites web sur mesure et de maintenance.

L’agence commercialise des packs d’heures de correction / maintenance à ses clients. 
Ces packs sont valables 1 an à partir de la date d’achat. Ils peuvent être de 5, 10 ou 50 heures, ou X heures suivant la demande du client.
Elle commercialise également des packs d’hébergement / maintenance de sites web avec 1 heure de correction / maintenance / conseil par mois.

Lorsqu’il fait une correction / maintenance / conseil dans la cadre d’un contrat d’heure, il note à l’aide d’un outil le temps qu’il y passe ainsi que la correction réalisée. 
L'agence peut ainsi livrer à ses clients un PDF avec un récapitulatif des corrections réalisées, la période de réalisation et le temps passé.

II - Objet

XXX souhaite mettre en place un outil en ligne ayant 2 objectifs : 
     - Pour les clients : Fournir un suivi des contrats de maintenance ainsi que la création et le suivi de tickets.
     - Pour l’administrateur : Avoir une vue d’ensemble des contrats, des tickets, leurs priorités, leur état et permettre de faire un export PDF des tâches accomplies à destination du client.

III - Enjeux 

XXX souhaite préserver de la transparence dans sa relation client. De part la facilité d’accès aux outils et la disponibilité du développeur s’occupant de la maintenance.


IV - Objectifs

    • Réduire le temps de navigation sur la vue des tickets
    • Rassurer le client sur les tâches effectuées 
    • Faciliter la création de ticket au client et à l’administrateur

V – Attentes et besoins

    A – Aspects graphiques

        FrontOffice
        XXX se veut être une agence dynamique avec un savoir faire technique qui doit se transcrire dans le design des outils proposés.
        Se référer au site de XXX 

        BackOffice
        L’interface administrateur doit faciliter l’accès à la création de ticket et la vue des tickets. 

    B - Fonctionnalités

        Front Office 
        • Créer un ticket et le paramétrer (priorité, thème, fichiers joints)
        • Envoyer un mail à XXX lors de la création d’un ticket
        • Modifier un ticket (si non encore affecté)
        • Demander la clôture d’un ticket
        • Insérer un commentaire lors de la demande de clôture d’un ticket
        • Consulter les tickets de son entreprises 
        • Consulter son profil
        • Modifier son profil

        BackOffice
        • Créer un ticket et le paramétrer (état, priorité, thème, étape, entreprise)
        • Envoyer un mail au client lors de la création d’un ticket
        • Filtrer les tickets (priorité, thème, date)
        • Créer une entreprise
        • Modifier une entreprise
        • Supprimer une entreprise
        • Créer un profil 
        • Modifier un profil
        • Supprimer un profil
        • Créer un contrat
        • Supprimer un contrat
        • Assigner un contrat à une entreprise
        • Paramétrer et générer des PDF par entreprise

    C – Le référencement

        Les pages de supports du site ne seront ni indexé et suivi étant donné le caractère confidentielle des informations mais aussi le peu de pertinence pour les robots des moteurs de recherche.

    D - Aspects techniques

        1 - Solution technique
		
            Backend : Laravel | API REST
            Frontend : adminLTE | Reactjs | Dropzone

        2 – Portabilité de la solution
		
		    L’outil sera consultable sur tout support (desktop, tablet et mobile). Il sera également compatible avec la majorité des navigateurs (IE, Edge, Chrome, Firefox, Safari)

        3 - Hébergement
		
		    O2Switch


	E - Aspects juridiques 

        Les données personnelles des clients pourront être supprimées conformément au RGPD.

	F - Sécurité 

        L’accès aux interfaces administrateur et client nécessitera une authentification préalable.
        Les fichiers transmis par les clients seront stockés dans un dossier storage protégé.
        L’API ne sera accessible qu’à partir d’urls reconnues par elle même.