package tienda;
import java.util.Date;
import java.util.List;

public class Pedido {
    private int codigo; 
    private int persona; 
    private Date fecha;
    private double importe;
    private String estado;
    private List<LineaPedido> lineas;
    private String direccionEnvio;


    public Pedido() {
    }

    public Pedido(int codigo, int persona, Date fecha, double importe, String estado, List<LineaPedido> lineas) {
        this.codigo = codigo;
        this.persona = persona;
        this.fecha = fecha;
        this.importe = importe;
        this.estado = estado;
        this.lineas = lineas;
    }

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public int getPersona() {
        return persona;
    }

    public void setPersona(int persona) {
        this.persona = persona;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public double getImporte() {
        return importe;
    }

    public void setImporte(double importe) {
        this.importe = importe;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<LineaPedido> getLineas() {
        return lineas;
    }

    public void setLineas(List<LineaPedido> lineas) {
        this.lineas = lineas;
    }

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

public void setDireccionEnvio(String direccionEnvio) {
    this.direccionEnvio = direccionEnvio;
}
}
