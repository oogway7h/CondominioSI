# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Administrador(models.Model):
    id_persona = models.OneToOneField('Persona', models.DO_NOTHING, db_column='id_persona', primary_key=True)
    id_cargo = models.CharField(max_length=60)

    class Meta:
        #managed = False
        db_table = 'administrador'


class AlertaIa(models.Model):
    id_alerta = models.BigAutoField(primary_key=True)
    tipo = models.TextField()  # This field type is a guess.
    detalle = models.TextField(blank=True, null=True)
    foto_url = models.TextField(blank=True, null=True)
    nivel_riesgo = models.IntegerField(blank=True, null=True)
    fecha_hora = models.DateTimeField()
    id_camara = models.ForeignKey('Camara', models.DO_NOTHING, db_column='id_camara', blank=True, null=True)
    id_persona = models.ForeignKey('Persona', models.DO_NOTHING, db_column='id_persona', blank=True, null=True)
    placa = models.ForeignKey('Vehiculo', models.DO_NOTHING, db_column='placa', blank=True, null=True)
    procesado = models.BooleanField()

    class Meta:
        #managed = False
        db_table = 'alerta_ia'



class Bitacora(models.Model):
    id_bitacora = models.BigAutoField(primary_key=True)
    id_persona = models.ForeignKey('Persona', models.DO_NOTHING, db_column='id_persona', blank=True, null=True)
    fecha_hora = models.DateTimeField()
    accion = models.CharField(max_length=160)
    detalle = models.TextField(blank=True, null=True)
    ip=models.GenericIPAddressField(null=True,blank=True)

    class Meta:
        #managed = False
        db_table = 'bitacora'


class Camara(models.Model):
    id_camara = models.BigAutoField(primary_key=True)
    ubicacion = models.CharField(max_length=160)
    estado = models.TextField()  # This field type is a guess.
    tipo = models.CharField(max_length=40, blank=True, null=True)
    rtsp_url = models.TextField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'camara'


class DetallePago(models.Model):
    id_detalle = models.BigAutoField(primary_key=True)
    id_pago = models.ForeignKey('Pago', models.DO_NOTHING, db_column='id_pago')
    descripcion = models.CharField(max_length=200)
    monto = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        #managed = False
        db_table = 'detalle_pago'


"""class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        #managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        #managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        #managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        #managed = False
        db_table = 'django_session'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        #managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        #managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        #managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        #managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)



"""
class EspacioComun(models.Model):
    id_espacio = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    capacidad = models.IntegerField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'espacio_comun'


class Inquilino(models.Model):
    id_persona = models.OneToOneField('Persona', models.DO_NOTHING, db_column='id_persona', primary_key=True)

    class Meta:
        #managed = False
        db_table = 'inquilino'


class Mensualidad(models.Model):
    id_cuota = models.BigAutoField(primary_key=True)
    mes = models.IntegerField()
    anio = models.IntegerField()
    id_propiedad = models.ForeignKey('Propiedad', models.DO_NOTHING, db_column='id_propiedad')
    estado = models.CharField(max_length=50, default='pendiente')
    class Meta:
        #managed = False
        db_table = 'mensualidad'
        unique_together = (('id_propiedad', 'mes', 'anio'),)


class Pago(models.Model):
    id_pago = models.BigAutoField(primary_key=True)
    id_cuota = models.ForeignKey(Mensualidad, models.DO_NOTHING, db_column='id_cuota',blank=True, null=True)
    id_persona = models.ForeignKey('Persona', models.DO_NOTHING, db_column='id_persona')
    id_infraccion = models.ForeignKey('Infraccion', models.DO_NOTHING, db_column='id_infraccion', blank=True, null=True)
    fecha = models.DateField()
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    estado = models.TextField()  # This field type is a guess.
    anio = models.IntegerField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'pago'


class Persona(models.Model):
    id_persona = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=120)
    telefono = models.CharField(max_length=30, blank=True, null=True)
    correo = models.CharField(unique=True, max_length=120, blank=True, null=True)
    face_ref = models.CharField(max_length=120, blank=True, null=True)
    es_activo = models.BooleanField()
    passwor = models.CharField(max_length=128, blank=True, null=True)
    ROL_CHOICES = (
        ('admin', 'Administrador'),
        ('residente', 'Residente'),
    )
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='residente')
    reset_token = models.CharField(max_length=128, blank=True, null=True)
    reset_token_expiry = models.DateTimeField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'persona'

    def set_password(self, raw_password):
        self.passwor = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.passwor)


class Propiedad(models.Model):
    id_propiedad = models.BigAutoField(primary_key=True)
    ubicacion = models.CharField(max_length=160)
    id_persona = models.ForeignKey(Persona, models.DO_NOTHING, db_column='id_persona')
    pertenece_a = models.CharField(max_length=12)

    class Meta:
        #managed = False
        db_table = 'propiedad'


class PropiedadPropietario(models.Model):
    pk = models.CompositePrimaryKey('id_propiedad', 'id_persona', 'desde')
    id_propiedad = models.ForeignKey(Propiedad, models.DO_NOTHING, db_column='id_propiedad')
    id_persona = models.ForeignKey('Propietario', models.DO_NOTHING, db_column='id_persona')
    desde = models.DateField()
    hasta = models.DateField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'propiedad_propietario'


class Propietario(models.Model):
    id_persona = models.OneToOneField(Persona, models.DO_NOTHING, db_column='id_persona', primary_key=True)

    class Meta:
        #managed = False
        db_table = 'propietario'


class RegistroAcceso(models.Model):
    id_acceso = models.BigAutoField(primary_key=True)
    id_persona = models.ForeignKey(Persona, models.DO_NOTHING, db_column='id_persona', blank=True, null=True)
    id_camara = models.ForeignKey(Camara, models.DO_NOTHING, db_column='id_camara', blank=True, null=True)
    tipo = models.TextField()  # This field type is a guess.
    placa = models.ForeignKey('Vehiculo', models.DO_NOTHING, db_column='placa', blank=True, null=True)
    foto_url = models.TextField(blank=True, null=True)
    fecha = models.DateField()
    hora_entrada = models.DateTimeField(blank=True, null=True)
    hora_salida = models.DateTimeField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'registro_acceso'


class Reserva(models.Model):
    id_reserva = models.BigAutoField(primary_key=True)
    id_espacio = models.ForeignKey(EspacioComun, models.DO_NOTHING, db_column='id_espacio')
    id_persona = models.ForeignKey(Persona, models.DO_NOTHING, db_column='id_persona')
    fecha = models.DateField()
    hora_inicio = models.DateTimeField()
    hora_fin = models.DateTimeField()

    class Meta:
        #managed = False
        db_table = 'reserva'


class Vehiculo(models.Model):
    placa = models.CharField(primary_key=True, max_length=15)
    id_persona = models.ForeignKey(Persona, models.DO_NOTHING, db_column='id_persona')
    marca = models.CharField(max_length=40, blank=True, null=True)
    modelo = models.CharField(max_length=40, blank=True, null=True)
    color = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'vehiculo'


from django.db import models
from django.utils import timezone

class Privilegio(models.Model):
    id_persona = models.OneToOneField(Persona, models.DO_NOTHING, db_column='id_persona', primary_key=True)
    corte_cesped = models.BooleanField(default=False)
    entrada_auto = models.BooleanField(default=False)
    recojo_basura = models.BooleanField(default=False)
    avisos_visita = models.BooleanField(default=False)
    acceso_gimnasio = models.BooleanField(default=False)
    acceso_piscina = models.BooleanField(default=False)
    acceso_sala_eventos = models.BooleanField(default=False)
    permisos_especiales = models.TextField(blank=True, null=True)#por si alguna persona tiene algun permiso especial
    
    
    creado_en = models.DateTimeField(auto_now_add=True)
    modificado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'privilegio'

class Infraccion(models.Model):
    id_infraccion = models.BigAutoField(primary_key=True)
    id_persona = models.ForeignKey('Persona', models.DO_NOTHING, db_column='id_persona')
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    descripcion = models.CharField(max_length=120, blank=True, null=True)
    fecha = models.DateField(auto_now_add=True)  
    estado = models.CharField(max_length=50, blank=True, null=True)  

    class Meta:
        db_table = "infraccion"


class Aviso(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    fecha_expiracion = models.DateTimeField(null=True, blank=True)  
    publicado_por = models.ForeignKey(Persona, on_delete=models.CASCADE)  
    visible = models.BooleanField(default=True)  

    class Meta:
        db_table="aviso"

    @property
    def esta_vigente(self):
        from django.utils import timezone
        if self.fecha_expiracion:
            return self.visible and self.fecha_expiracion >= timezone.now()
        return self.visible
    

